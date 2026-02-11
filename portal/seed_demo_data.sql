-- ============================================================
-- BookedEat Portal: Seed Demo Dashboard Data
-- Run this in the Supabase SQL Editor
-- ============================================================
-- This script:
--   1. Finds your partner record + restaurant
--   2. Creates 5 diverse deals (if they don't already exist)
--   3. Inserts ~120 redemptions spread over 30 days
--      with realistic variation (weekends busier, ramp-up trend)
-- ============================================================

DO $$
DECLARE
  -- !! CHANGE THIS to your partner login email !!
  v_email           TEXT := 'testaurant@test.com';
  v_partner_user_id UUID;
  v_restaurant_id   UUID;
  v_deal_ids        UUID[] := '{}';
  v_deal_id         UUID;
  v_user_ids        UUID[];
  v_day             DATE;
  v_count           INT;
  v_i               INT;
  v_rand_deal       INT;
  v_rand_user       INT;
  v_code            TEXT;
  v_ts              TIMESTAMPTZ;
  v_status          TEXT;
BEGIN

  -- ─── 1. Resolve partner ───────────────────────────────────
  SELECT p.id INTO v_partner_user_id
  FROM auth.users u
  JOIN public.profiles p ON p.id = u.id
  WHERE u.email = v_email
  LIMIT 1;

  IF v_partner_user_id IS NULL THEN
    RAISE EXCEPTION 'No profile found for that email. Check the address.';
  END IF;

  SELECT restaurant_id INTO v_restaurant_id
  FROM public.partners
  WHERE user_id = v_partner_user_id AND is_verified = true
  LIMIT 1;

  IF v_restaurant_id IS NULL THEN
    RAISE EXCEPTION 'No verified partner record found for this user.';
  END IF;

  RAISE NOTICE 'Partner user: %, Restaurant: %', v_partner_user_id, v_restaurant_id;

  -- ─── 2. Create 5 demo deals ──────────────────────────────
  -- Deal 1: 20% off all mains (percent)
  INSERT INTO public.deals (restaurant_id, partner_id, title, description, discount_type, discount_value, valid_days, is_active)
  VALUES (v_restaurant_id, v_partner_user_id,
          '20% Off All Mains', 'Valid on all main courses during weekdays',
          'percent', 20, ARRAY['Mon','Tue','Wed','Thu','Fri'], true)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_deal_id;
  IF v_deal_id IS NOT NULL THEN v_deal_ids := v_deal_ids || v_deal_id; END IF;

  -- Deal 2: Buy 1 Get 1 Free (bogo)
  INSERT INTO public.deals (restaurant_id, partner_id, title, description, discount_type, discount_value, valid_days, valid_time_start, valid_time_end, is_active)
  VALUES (v_restaurant_id, v_partner_user_id,
          'BOGO Cocktails', 'Buy one cocktail, get the second free. Happy hour only.',
          'bogo', 1, ARRAY['Thu','Fri','Sat'], '17:00', '19:00', true)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_deal_id;
  IF v_deal_id IS NOT NULL THEN v_deal_ids := v_deal_ids || v_deal_id; END IF;

  -- Deal 3: CHF 15 off (fixed)
  INSERT INTO public.deals (restaurant_id, partner_id, title, description, discount_type, discount_value, max_per_user, is_active)
  VALUES (v_restaurant_id, v_partner_user_id,
          'CHF 15 Off Your Bill', 'For orders above CHF 60',
          'fixed', 15, 2, true)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_deal_id;
  IF v_deal_id IS NOT NULL THEN v_deal_ids := v_deal_ids || v_deal_id; END IF;

  -- Deal 4: 3-Course Set Menu (set_menu)
  INSERT INTO public.deals (restaurant_id, partner_id, title, description, discount_type, discount_value, price, original_price, included_items, is_active)
  VALUES (v_restaurant_id, v_partner_user_id,
          '3-Course Lunch Menu', 'Starter, main, and dessert at a special price',
          'set_menu', 0, 39, 58, '["Soup of the Day","Grilled Salmon or Risotto","Tiramisu"]'::jsonb, true)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_deal_id;
  IF v_deal_id IS NOT NULL THEN v_deal_ids := v_deal_ids || v_deal_id; END IF;

  -- Deal 5: Free Dessert (free_item) — inactive
  INSERT INTO public.deals (restaurant_id, partner_id, title, description, discount_type, discount_value, item_description, is_active)
  VALUES (v_restaurant_id, v_partner_user_id,
          'Free Dessert', 'Complimentary dessert with any main course',
          'free_item', 1, 'House Dessert', false)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_deal_id;
  IF v_deal_id IS NOT NULL THEN v_deal_ids := v_deal_ids || v_deal_id; END IF;

  -- If no new deals were created, grab existing ones
  IF array_length(v_deal_ids, 1) IS NULL OR array_length(v_deal_ids, 1) = 0 THEN
    SELECT array_agg(id) INTO v_deal_ids
    FROM public.deals
    WHERE restaurant_id = v_restaurant_id
    LIMIT 5;
  END IF;

  IF array_length(v_deal_ids, 1) IS NULL OR array_length(v_deal_ids, 1) = 0 THEN
    RAISE EXCEPTION 'No deals found or created for this restaurant.';
  END IF;

  RAISE NOTICE 'Using % deals', array_length(v_deal_ids, 1);

  -- ─── 3. Gather some user IDs for fake redemptions ─────────
  -- Pick up to 25 distinct profiles (excluding the partner)
  SELECT array_agg(id) INTO v_user_ids
  FROM (
    SELECT id FROM public.profiles
    WHERE id != v_partner_user_id
    ORDER BY random()
    LIMIT 25
  ) sub;

  -- If not enough users, include the partner themselves
  IF v_user_ids IS NULL OR array_length(v_user_ids, 1) < 3 THEN
    v_user_ids := ARRAY[v_partner_user_id];
  END IF;

  RAISE NOTICE 'Using % user profiles for redemptions', array_length(v_user_ids, 1);

  -- ─── 4. Generate redemptions over 30 days ─────────────────
  -- Pattern: gradual ramp-up + weekend spikes + some randomness
  FOR v_day IN
    SELECT d::date FROM generate_series(CURRENT_DATE - 29, CURRENT_DATE, '1 day') d
  LOOP
    -- Base count: ramp from 1→5 over 30 days
    v_count := 1 + ((v_day - (CURRENT_DATE - 29)) * 4 / 29);

    -- Weekend boost (Fri=+2, Sat=+3, Sun=+1)
    IF extract(dow FROM v_day) = 5 THEN v_count := v_count + 2;
    ELSIF extract(dow FROM v_day) = 6 THEN v_count := v_count + 3;
    ELSIF extract(dow FROM v_day) = 0 THEN v_count := v_count + 1;
    END IF;

    -- Random jitter ±1
    v_count := v_count + (floor(random() * 3) - 1)::int;
    IF v_count < 0 THEN v_count := 0; END IF;
    IF v_count > 10 THEN v_count := 10; END IF;

    FOR v_i IN 1..v_count LOOP
      -- Pick random deal and user
      v_rand_deal := 1 + floor(random() * array_length(v_deal_ids, 1))::int;
      v_rand_user := 1 + floor(random() * array_length(v_user_ids, 1))::int;

      -- Clamp indices
      IF v_rand_deal > array_length(v_deal_ids, 1) THEN v_rand_deal := array_length(v_deal_ids, 1); END IF;
      IF v_rand_user > array_length(v_user_ids, 1) THEN v_rand_user := array_length(v_user_ids, 1); END IF;

      -- Random time of day (11:00 — 22:00)
      v_ts := v_day + (interval '11 hours') + (random() * interval '11 hours');

      -- Generate a unique 6-char code
      v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

      -- 80% confirmed, 15% generated (pending), 5% expired
      IF random() < 0.80 THEN
        v_status := 'confirmed';
      ELSIF random() < 0.75 THEN
        v_status := 'generated';
      ELSE
        v_status := 'expired';
      END IF;

      BEGIN
        INSERT INTO public.deal_redemptions (deal_id, user_id, code, status, generated_at, confirmed_at, expires_at)
        VALUES (
          v_deal_ids[v_rand_deal],
          v_user_ids[v_rand_user],
          v_code,
          v_status,
          v_ts,
          CASE WHEN v_status = 'confirmed' THEN v_ts + interval '5 minutes' ELSE NULL END,
          v_ts + interval '30 minutes'
        );
      EXCEPTION WHEN unique_violation THEN
        -- Skip duplicate codes (very rare)
        NULL;
      END;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Done! Redemptions seeded across 30 days.';

END $$;

-- ─── Quick verification ──────────────────────────────────────
-- Run these after the script to confirm data:

-- Total redemptions inserted:
-- SELECT count(*) FROM deal_redemptions r JOIN deals d ON d.id = r.deal_id WHERE d.restaurant_id = (SELECT restaurant_id FROM partners WHERE is_verified LIMIT 1);

-- Daily distribution:
-- SELECT generated_at::date AS day, count(*) FROM deal_redemptions r JOIN deals d ON d.id = r.deal_id WHERE d.restaurant_id = (SELECT restaurant_id FROM partners WHERE is_verified LIMIT 1) GROUP BY 1 ORDER BY 1;

-- Per-deal breakdown:
-- SELECT d.title, count(r.id) FROM deals d LEFT JOIN deal_redemptions r ON r.deal_id = d.id WHERE d.restaurant_id = (SELECT restaurant_id FROM partners WHERE is_verified LIMIT 1) GROUP BY d.title ORDER BY count DESC;
