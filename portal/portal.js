(function () {
  'use strict';

  // ============================================================
  //  STATE
  // ============================================================
  var partner = null;   // { id, userId, restaurantId, isVerified, restaurantName, restaurantAddress, restaurantPhotos }
  var deals = [];       // array of deal objects
  var currentScreen = null;
  var editingDealId = null;
  var posts = [];
  var editingPostId = null;
  var postImageKeys = [];     // S3 keys to save
  var postImagePreviews = []; // display URLs (blob or signed)
  var pieChart = null;
  var lineChart = null;
  var currentLang = localStorage.getItem('portal_lang') || 'en';

  // ============================================================
  //  TRANSLATIONS
  // ============================================================
  var TRANSLATIONS = {
    en: {
      'nav.restaurant_settings': 'Restaurant Settings',
      'nav.sign_out': 'Sign Out',
      'login.title': 'Partner Sign In',
      'login.subtitle': 'Sign in with your restaurant account',
      'login.email': 'Email',
      'login.password': 'Password',
      'login.submit': 'Sign In',
      'login.email_placeholder': 'you@restaurant.com',
      'login.password_placeholder': 'Your password',
      'login.or': 'or',
      'login.pending_verification': 'Your account is pending verification. We will contact you soon.',
      'login.no_partner': 'No partner account found for this Google account. Contact us at partners@bookedeat.com to register your restaurant.',
      'dashboard.subtitle': 'Partner Dashboard',
      'dashboard.active_deals': 'Active Deals',
      'dashboard.redemptions': 'Redemptions',
      'dashboard.guests': 'Guests',
      'dashboard.chart_pie': 'Redemptions by Deal',
      'dashboard.chart_line': 'Daily Guests',
      'dashboard.chart_line_sub': 'Last 30 days',
      'dashboard.pie_empty': 'No redemption data yet',
      'dashboard.line_empty': 'No guest data yet',
      'dashboard.filter_all': 'All Time',
      'dashboard.filter_7d': '7 Days',
      'dashboard.filter_30d': '30 Days',
      'dashboard.filter_90d': '90 Days',
      'dashboard.filter_ytd': 'YTD',
      'dashboard.more_deals': 'more',
      'dashboard.show_less': 'Show less',
      'dashboard.manage_deals': 'Manage Deals',
      'dashboard.verify_code': 'Verify Code',
      'dashboard.check_codes': 'Check customer codes',
      'dashboard.billing': 'Billing & Receipts',
      'dashboard.view_billing': 'View billing details',
      'dashboard.total_deals': '{0} total deals',
      'dashboard.outstanding': 'CHF {0} outstanding',
      'dashboard.value_text': '{0} unique customers brought to your restaurant',
      'deals.title': 'Manage Deals',
      'deals.all': 'All',
      'deals.active': 'Active',
      'deals.inactive': 'Inactive',
      'deals.empty': 'No deals yet',
      'deals.create_first': 'Create First Deal',
      'deals.payment_required': 'Please add a payment method in Billing before creating deals.',
      'deals.redemptions': '{0} redemptions',
      'deals.delete_title': 'Delete Deal',
      'deals.delete_message': 'Are you sure you want to delete "{0}"? This cannot be undone.',
      'form.create_deal': 'Create Deal',
      'form.edit_deal': 'Edit Deal',
      'form.save_changes': 'Save Changes',
      'form.deal_type': 'Deal Type',
      'form.deal_details': 'Deal Details',
      'form.title': 'Title *',
      'form.title_placeholder': 'e.g., 20% off lunch menu',
      'form.description': 'Description (optional)',
      'form.description_placeholder': 'Brief description of the deal',
      'form.percentage': 'Percentage (1-100)',
      'form.amount_chf': 'Amount (CHF)',
      'form.item_bogo': 'Item (e.g., "main dish")',
      'form.item_free': 'Free item (e.g., "dessert")',
      'form.item_menu': 'Menu item (e.g., "pasta menu")',
      'form.menu_pricing': 'Menu Pricing',
      'form.event_pricing': 'Event Pricing',
      'form.price': 'Price (CHF) *',
      'form.price_placeholder': 'e.g., 49',
      'form.original_price': 'Original Price (CHF)',
      'form.original_price_placeholder': 'e.g., 65',
      'form.included_items': 'Included Items',
      'form.included_items_placeholder': 'e.g., Starter, Main Course, Dessert',
      'form.limits': 'Limits',
      'form.max_per_user': 'Max uses per customer (empty = unlimited)',
      'form.cooldown': 'Cooldown Period',
      'form.cooldown_none': 'None',
      'form.cooldown_7': '7 days',
      'form.cooldown_14': '14 days',
      'form.cooldown_30': '30 days',
      'form.schedule': 'Schedule',
      'form.schedule_helper': 'Leave blank for always available',
      'form.valid_days': 'Valid days',
      'form.start_date': 'Start date',
      'form.end_date': 'End date',
      'form.start_time': 'Start time',
      'form.end_time': 'End time',
      'form.event_dates': 'Event Dates',
      'form.insider_deal': 'Insider Deal',
      'form.insider_helper': 'Add unique codes for each influencer. Their followers enter the code to unlock this deal.',
      'form.no_codes': 'No influencer codes yet. Add one below.',
      'form.giveaway_recipients': 'Giveaway Recipients',
      'form.giveaway_helper': 'Enter the name and email of users to grant this giveaway to.',
      'form.no_recipients': 'No recipients yet. Add users below to grant this giveaway.',
      'form.grant': 'Grant',
      'form.add': 'Add',
      'form.full_name': 'Full name',
      'form.email_address': 'Email address',
      'form.per_unlock': 'Per unlock',
      'form.fixed': 'Fixed',
      'type.percent': 'Percent Off',
      'type.fixed': 'CHF Off',
      'type.bogo': 'BOGO',
      'type.free_item': 'Free Item',
      'type.menu_discount': 'Menu Discount',
      'type.set_menu': 'Set Menu',
      'type.special_event': 'Special Event',
      'type.giveaway': 'Giveaway',
      'day.mon': 'Mon', 'day.tue': 'Tue', 'day.wed': 'Wed', 'day.thu': 'Thu',
      'day.fri': 'Fri', 'day.sat': 'Sat', 'day.sun': 'Sun',
      'day.monday': 'Monday', 'day.tuesday': 'Tuesday', 'day.wednesday': 'Wednesday',
      'day.thursday': 'Thursday', 'day.friday': 'Friday', 'day.saturday': 'Saturday', 'day.sunday': 'Sunday',
      'billing.title': 'Billing & Receipts',
      'billing.billing': 'Billing',
      'billing.total_redemptions': 'Total Redemptions',
      'billing.fee': 'BookedEat Fee',
      'billing.fee_note': 'CHF 0.50 per redemption',
      'billing.influencer_comp': 'Influencer Compensation',
      'billing.total_owed': 'Total Owed',
      'billing.contact': 'Contact for Payment',
      'billing.payment_method': 'Payment Method',
      'billing.save_card': 'Save Card',
      'billing.saving_card': 'Saving...',
      'billing.no_payment_method': 'No payment method on file. Add a card to enable automatic monthly billing.',
      'billing.card_saved': 'Card saved successfully',
      'billing.change_card': 'Change',
      'billing.remove_card': 'Remove',
      'billing.payment_history': 'Payment History',
      'billing.no_receipts': 'No payment history yet',
      'billing.spending_limit': 'Spending Limit',
      'billing.spending_limit_desc': 'Set a maximum monthly spend. Deals auto-deactivate when reached. Includes platform fees and influencer compensation.',
      'billing.save_limit': 'Save',
      'billing.current_spend': 'This month: CHF {0}',
      'billing.trial_active': 'Free Trial Active',
      'billing.trial_days_left': '{0} days remaining',
      'billing.try_free': 'Try BookedEat Free',
      'billing.trial_desc': 'Start a 7-day free trial to create deals without a payment method.',
      'billing.start_trial': 'Start Free Trial',
      'billing.download': 'Download',
      'billing.paid': 'Paid',
      'billing.pending': 'Pending',
      'billing.receipt_redemptions': '{0} redemptions',
      'billing.receipt_paid_with': 'Paid with {0}',
      'billing.receipt_title': 'Receipt',
      'billing.receipt_number': 'Receipt No',
      'billing.receipt_date': 'Date',
      'billing.receipt_period': 'Period',
      'billing.receipt_bill_to': 'Bill To',
      'billing.receipt_description': 'Description',
      'billing.receipt_amount': 'Amount',
      'billing.receipt_platform_fee': 'BookedEat Platform Fee',
      'billing.receipt_line_detail': '{0} redemptions x CHF 0.50',
      'billing.receipt_total': 'Total',
      'billing.receipt_payment': 'Payment',
      'billing.receipt_status': 'Status',
      'billing.receipt_thank_you': 'Thank you for partnering with BookedEat.',
      'rs.title': 'Restaurant Settings',
      'rs.contact_info': 'Contact Information',
      'rs.phone': 'Phone Number',
      'rs.phone_placeholder': 'e.g., +41 44 123 45 67',
      'rs.website': 'Website',
      'rs.website_placeholder': 'e.g., https://www.myrestaurant.ch',
      'rs.save': 'Save',
      'rs.saving': 'Saving...',
      'rs.saved': 'Saved!',
      'rs.failed': 'Failed to save',
      'rs.opening_hours': 'Opening Hours',
      'rs.edit': 'Edit',
      'rs.no_hours': 'No opening hours set',
      'rs.cancel': 'Cancel',
      'rs.closed': 'Closed',
      'verify.title': 'Verify Code',
      'verify.info': '<strong>Automatic verification</strong> &mdash; Customers can only redeem deals when they are within 100 metres of your restaurant. Codes are confirmed automatically upon redemption, so manual verification is typically not required. Use this tool if you\'d like to double-check a code on the spot.',
      'verify.heading': 'Enter Customer Code',
      'verify.subtitle': 'Enter the 6-character code shown by your customer',
      'verify.button': 'Verify',
      'verify.confirmed': 'Code Confirmed!',
      'verify.failed': 'Verification Failed',
      'verify.another': 'Verify Another Code',
      'verify.try_again': 'Try Again',
      'dialog.cancel': 'Cancel',
      'dialog.delete': 'Delete',
      'dialog.sign_out': 'Sign Out',
      'dialog.sign_out_confirm': 'Are you sure you want to sign out?',
      'month.0': 'January', 'month.1': 'February', 'month.2': 'March',
      'month.3': 'April', 'month.4': 'May', 'month.5': 'June',
      'month.6': 'July', 'month.7': 'August', 'month.8': 'September',
      'month.9': 'October', 'month.10': 'November', 'month.11': 'December',
      'cal.su': 'Su', 'cal.mo': 'Mo', 'cal.tu': 'Tu', 'cal.we': 'We',
      'cal.th': 'Th', 'cal.fr': 'Fr', 'cal.sa': 'Sa',
      'today': 'today',
      'dashboard.news_posts': 'News Posts',
      'dashboard.share_updates': 'Share updates with followers',
      'posts.title': 'News Posts',
      'posts.empty': 'No posts yet',
      'posts.create_first': 'Create First Post',
      'posts.delete_title': 'Delete Post',
      'posts.delete_message': 'Are you sure you want to delete "{0}"? This cannot be undone.',
      'posts.draft': 'Draft',
      'posts.published': 'Published',
      'post_form.create': 'Create Post',
      'post_form.edit': 'Edit Post',
      'post_form.save': 'Save Changes',
      'post_form.title': 'Title *',
      'post_form.title_placeholder': 'e.g., New summer menu now available!',
      'post_form.body': 'Body',
      'post_form.body_placeholder': 'Tell your followers about what\'s new...',
      'post_form.post_type': 'Post Type',
      'post_form.type_update': 'Update',
      'post_form.type_event': 'Event',
      'post_form.type_menu': 'Menu',
      'post_form.type_announcement': 'Announcement',
      'post_form.type_promotion': 'Promotion',
      'post_form.images': 'Images',
      'post_form.upload_images': 'Upload Images',
      'post_form.uploading': 'Uploading...',
      'post_form.attach_deal': 'Attach Deal (optional)',
      'post_form.no_deal': 'No deal attached',
      'post_form.event_date': 'Event Date (optional)',
      'post_form.publish': 'Publish',
      'post_form.creating': 'Creating...',
      'post_form.saving': 'Saving...'
    },
    de: {
      'nav.restaurant_settings': 'Restaurant-Einstellungen',
      'nav.sign_out': 'Abmelden',
      'login.title': 'Partner-Anmeldung',
      'login.subtitle': 'Melden Sie sich mit Ihrem Restaurant-Konto an',
      'login.email': 'E-Mail',
      'login.password': 'Passwort',
      'login.submit': 'Anmelden',
      'login.email_placeholder': 'sie@restaurant.com',
      'login.password_placeholder': 'Ihr Passwort',
      'login.or': 'oder',
      'login.pending_verification': 'Ihr Konto wird gerade verifiziert. Wir melden uns bei Ihnen.',
      'login.no_partner': 'Kein Partner-Konto f\u00fcr dieses Google-Konto gefunden. Kontaktieren Sie uns unter partners@bookedeat.com, um Ihr Restaurant zu registrieren.',
      'dashboard.subtitle': 'Partner-Dashboard',
      'dashboard.active_deals': 'Aktive Deals',
      'dashboard.redemptions': 'Einl\u00f6sungen',
      'dashboard.guests': 'G\u00e4ste',
      'dashboard.chart_pie': 'Einl\u00f6sungen nach Deal',
      'dashboard.chart_line': 'T\u00e4gliche G\u00e4ste',
      'dashboard.chart_line_sub': 'Letzte 30 Tage',
      'dashboard.filter_all': 'Gesamt',
      'dashboard.filter_7d': '7 Tage',
      'dashboard.filter_30d': '30 Tage',
      'dashboard.filter_90d': '90 Tage',
      'dashboard.filter_ytd': 'Dieses Jahr',
      'dashboard.more_deals': 'weitere',
      'dashboard.show_less': 'Weniger',
      'dashboard.pie_empty': 'Noch keine Einl\u00f6sungsdaten',
      'dashboard.line_empty': 'Noch keine G\u00e4stedaten',
      'dashboard.manage_deals': 'Deals verwalten',
      'dashboard.verify_code': 'Code pr\u00fcfen',
      'dashboard.check_codes': 'Kundencodes pr\u00fcfen',
      'dashboard.billing': 'Abrechnung & Belege',
      'dashboard.view_billing': 'Abrechnungsdetails anzeigen',
      'dashboard.total_deals': '{0} Deals insgesamt',
      'dashboard.outstanding': 'CHF {0} ausstehend',
      'dashboard.value_text': '{0} einzigartige Kunden in Ihr Restaurant gebracht',
      'deals.title': 'Deals verwalten',
      'deals.all': 'Alle',
      'deals.active': 'Aktiv',
      'deals.inactive': 'Inaktiv',
      'deals.empty': 'Noch keine Deals',
      'deals.create_first': 'Ersten Deal erstellen',
      'deals.payment_required': 'Bitte f\u00fcgen Sie zuerst eine Zahlungsmethode unter Abrechnung hinzu.',
      'deals.redemptions': '{0} Einl\u00f6sungen',
      'deals.delete_title': 'Deal l\u00f6schen',
      'deals.delete_message': 'Sind Sie sicher, dass Sie \u201e{0}\u201c l\u00f6schen m\u00f6chten? Dies kann nicht r\u00fcckg\u00e4ngig gemacht werden.',
      'form.create_deal': 'Deal erstellen',
      'form.edit_deal': 'Deal bearbeiten',
      'form.save_changes': '\u00c4nderungen speichern',
      'form.deal_type': 'Deal-Typ',
      'form.deal_details': 'Deal-Details',
      'form.title': 'Titel *',
      'form.title_placeholder': 'z.B. 20% Rabatt auf Mittagsmen\u00fc',
      'form.description': 'Beschreibung (optional)',
      'form.description_placeholder': 'Kurze Beschreibung des Deals',
      'form.percentage': 'Prozentsatz (1\u2013100)',
      'form.amount_chf': 'Betrag (CHF)',
      'form.item_bogo': 'Artikel (z.B. \u201eHauptgericht\u201c)',
      'form.item_free': 'Gratisartikel (z.B. \u201eDessert\u201c)',
      'form.item_menu': 'Men\u00fcartikel (z.B. \u201ePasta-Men\u00fc\u201c)',
      'form.menu_pricing': 'Men\u00fcpreise',
      'form.event_pricing': 'Eventpreise',
      'form.price': 'Preis (CHF) *',
      'form.price_placeholder': 'z.B. 49',
      'form.original_price': 'Originalpreis (CHF)',
      'form.original_price_placeholder': 'z.B. 65',
      'form.included_items': 'Enthaltene Artikel',
      'form.included_items_placeholder': 'z.B. Vorspeise, Hauptgang, Dessert',
      'form.limits': 'Limits',
      'form.max_per_user': 'Max. Nutzungen pro Kunde (leer = unbegrenzt)',
      'form.cooldown': 'Wartezeit',
      'form.cooldown_none': 'Keine',
      'form.cooldown_7': '7 Tage',
      'form.cooldown_14': '14 Tage',
      'form.cooldown_30': '30 Tage',
      'form.schedule': 'Zeitplan',
      'form.schedule_helper': 'Leer lassen f\u00fcr immer verf\u00fcgbar',
      'form.valid_days': 'G\u00fcltige Tage',
      'form.start_date': 'Startdatum',
      'form.end_date': 'Enddatum',
      'form.start_time': 'Startzeit',
      'form.end_time': 'Endzeit',
      'form.event_dates': 'Eventdaten',
      'form.insider_deal': 'Insider-Deal',
      'form.insider_helper': 'F\u00fcgen Sie einzigartige Codes f\u00fcr jeden Influencer hinzu. Deren Follower geben den Code ein, um diesen Deal freizuschalten.',
      'form.no_codes': 'Noch keine Influencer-Codes. F\u00fcgen Sie unten einen hinzu.',
      'form.giveaway_recipients': 'Gewinnspiel-Empf\u00e4nger',
      'form.giveaway_helper': 'Geben Sie den Namen und die E-Mail der Benutzer ein, denen dieses Gewinnspiel gew\u00e4hrt werden soll.',
      'form.no_recipients': 'Noch keine Empf\u00e4nger. F\u00fcgen Sie unten Benutzer hinzu.',
      'form.grant': 'Gew\u00e4hren',
      'form.add': 'Hinzuf\u00fcgen',
      'form.full_name': 'Vollst\u00e4ndiger Name',
      'form.email_address': 'E-Mail-Adresse',
      'form.per_unlock': 'Pro Freischaltung',
      'form.fixed': 'Pauschal',
      'type.percent': 'Prozent-Rabatt',
      'type.fixed': 'CHF-Rabatt',
      'type.bogo': 'BOGO',
      'type.free_item': 'Gratisartikel',
      'type.menu_discount': 'Men\u00fc-Rabatt',
      'type.set_menu': 'Set-Men\u00fc',
      'type.special_event': 'Spezialevent',
      'type.giveaway': 'Gewinnspiel',
      'day.mon': 'Mo', 'day.tue': 'Di', 'day.wed': 'Mi', 'day.thu': 'Do',
      'day.fri': 'Fr', 'day.sat': 'Sa', 'day.sun': 'So',
      'day.monday': 'Montag', 'day.tuesday': 'Dienstag', 'day.wednesday': 'Mittwoch',
      'day.thursday': 'Donnerstag', 'day.friday': 'Freitag', 'day.saturday': 'Samstag', 'day.sunday': 'Sonntag',
      'billing.title': 'Abrechnung & Belege',
      'billing.billing': 'Abrechnung',
      'billing.total_redemptions': 'Gesamteinl\u00f6sungen',
      'billing.fee': 'BookedEat-Geb\u00fchr',
      'billing.fee_note': 'CHF 0.50 pro Einl\u00f6sung',
      'billing.influencer_comp': 'Influencer-Verg\u00fctung',
      'billing.total_owed': 'Gesamtbetrag',
      'billing.contact': 'Zahlung kontaktieren',
      'billing.payment_method': 'Zahlungsmethode',
      'billing.save_card': 'Karte speichern',
      'billing.saving_card': 'Speichern\u2026',
      'billing.no_payment_method': 'Keine Zahlungsmethode hinterlegt. F\u00fcgen Sie eine Karte hinzu, um die automatische monatliche Abrechnung zu aktivieren.',
      'billing.card_saved': 'Karte erfolgreich gespeichert',
      'billing.change_card': '\u00c4ndern',
      'billing.remove_card': 'Entfernen',
      'billing.payment_history': 'Zahlungsverlauf',
      'billing.no_receipts': 'Noch kein Zahlungsverlauf',
      'billing.spending_limit': 'Ausgabenlimit',
      'billing.spending_limit_desc': 'Maximales Monatsbudget festlegen. Deals werden automatisch deaktiviert. Beinhaltet Plattformgeb\u00fchren und Influencer-Verg\u00fctung.',
      'billing.save_limit': 'Speichern',
      'billing.current_spend': 'Dieser Monat: CHF {0}',
      'billing.trial_active': 'Kostenlose Testphase aktiv',
      'billing.trial_days_left': 'Noch {0} Tage',
      'billing.try_free': 'BookedEat kostenlos testen',
      'billing.trial_desc': 'Starten Sie eine 7-t\u00e4gige Testphase, um Deals ohne Zahlungsmethode zu erstellen.',
      'billing.start_trial': 'Testphase starten',
      'billing.download': 'Herunterladen',
      'billing.paid': 'Bezahlt',
      'billing.pending': 'Ausstehend',
      'billing.receipt_redemptions': '{0} Einl\u00f6sungen',
      'billing.receipt_paid_with': 'Bezahlt mit {0}',
      'billing.receipt_title': 'Beleg',
      'billing.receipt_number': 'Belegnr.',
      'billing.receipt_date': 'Datum',
      'billing.receipt_period': 'Zeitraum',
      'billing.receipt_bill_to': 'Rechnungsempf\u00e4nger',
      'billing.receipt_description': 'Beschreibung',
      'billing.receipt_amount': 'Betrag',
      'billing.receipt_platform_fee': 'BookedEat Plattformgeb\u00fchr',
      'billing.receipt_line_detail': '{0} Einl\u00f6sungen x CHF 0.50',
      'billing.receipt_total': 'Gesamt',
      'billing.receipt_payment': 'Zahlung',
      'billing.receipt_status': 'Status',
      'billing.receipt_thank_you': 'Vielen Dank f\u00fcr Ihre Partnerschaft mit BookedEat.',
      'rs.title': 'Restaurant-Einstellungen',
      'rs.contact_info': 'Kontaktinformationen',
      'rs.phone': 'Telefonnummer',
      'rs.phone_placeholder': 'z.B. +41 44 123 45 67',
      'rs.website': 'Webseite',
      'rs.website_placeholder': 'z.B. https://www.meinrestaurant.ch',
      'rs.save': 'Speichern',
      'rs.saving': 'Speichern\u2026',
      'rs.saved': 'Gespeichert!',
      'rs.failed': 'Speichern fehlgeschlagen',
      'rs.opening_hours': '\u00d6ffnungszeiten',
      'rs.edit': 'Bearbeiten',
      'rs.no_hours': 'Keine \u00d6ffnungszeiten festgelegt',
      'rs.cancel': 'Abbrechen',
      'rs.closed': 'Geschlossen',
      'verify.title': 'Code pr\u00fcfen',
      'verify.info': '<strong>Automatische Verifizierung</strong> &mdash; Kunden k\u00f6nnen Deals nur einl\u00f6sen, wenn sie sich innerhalb von 100 Metern von Ihrem Restaurant befinden. Codes werden bei der Einl\u00f6sung automatisch best\u00e4tigt, sodass eine manuelle \u00dcberpr\u00fcfung in der Regel nicht erforderlich ist. Verwenden Sie dieses Tool, wenn Sie einen Code vor Ort \u00fcberpr\u00fcfen m\u00f6chten.',
      'verify.heading': 'Kundencode eingeben',
      'verify.subtitle': 'Geben Sie den 6-stelligen Code Ihres Kunden ein',
      'verify.button': 'Pr\u00fcfen',
      'verify.confirmed': 'Code best\u00e4tigt!',
      'verify.failed': 'Verifizierung fehlgeschlagen',
      'verify.another': 'Weiteren Code pr\u00fcfen',
      'verify.try_again': 'Erneut versuchen',
      'dialog.cancel': 'Abbrechen',
      'dialog.delete': 'L\u00f6schen',
      'dialog.sign_out': 'Abmelden',
      'dialog.sign_out_confirm': 'Sind Sie sicher, dass Sie sich abmelden m\u00f6chten?',
      'month.0': 'Januar', 'month.1': 'Februar', 'month.2': 'M\u00e4rz',
      'month.3': 'April', 'month.4': 'Mai', 'month.5': 'Juni',
      'month.6': 'Juli', 'month.7': 'August', 'month.8': 'September',
      'month.9': 'Oktober', 'month.10': 'November', 'month.11': 'Dezember',
      'cal.su': 'So', 'cal.mo': 'Mo', 'cal.tu': 'Di', 'cal.we': 'Mi',
      'cal.th': 'Do', 'cal.fr': 'Fr', 'cal.sa': 'Sa',
      'today': 'heute',
      'dashboard.news_posts': 'News-Beiträge',
      'dashboard.share_updates': 'Teilen Sie Updates mit Followern',
      'posts.title': 'News-Beiträge',
      'posts.empty': 'Noch keine Beiträge',
      'posts.create_first': 'Ersten Beitrag erstellen',
      'posts.delete_title': 'Beitrag löschen',
      'posts.delete_message': 'Sind Sie sicher, dass Sie \u201e{0}\u201c löschen möchten? Dies kann nicht rückgängig gemacht werden.',
      'posts.draft': 'Entwurf',
      'posts.published': 'Veröffentlicht',
      'post_form.create': 'Beitrag erstellen',
      'post_form.edit': 'Beitrag bearbeiten',
      'post_form.save': 'Änderungen speichern',
      'post_form.title': 'Titel *',
      'post_form.title_placeholder': 'z.B. Neue Sommerkarte jetzt verfügbar!',
      'post_form.body': 'Inhalt',
      'post_form.body_placeholder': 'Erzählen Sie Ihren Followern, was es Neues gibt...',
      'post_form.post_type': 'Beitragstyp',
      'post_form.type_update': 'Update',
      'post_form.type_event': 'Event',
      'post_form.type_menu': 'Menü',
      'post_form.type_announcement': 'Ankündigung',
      'post_form.type_promotion': 'Aktion',
      'post_form.images': 'Bilder',
      'post_form.upload_images': 'Bilder hochladen',
      'post_form.uploading': 'Wird hochgeladen...',
      'post_form.attach_deal': 'Deal anhängen (optional)',
      'post_form.no_deal': 'Kein Deal angehängt',
      'post_form.event_date': 'Eventdatum (optional)',
      'post_form.publish': 'Veröffentlichen',
      'post_form.creating': 'Wird erstellt...',
      'post_form.saving': 'Wird gespeichert...'
    }
  };

  function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ||
           TRANSLATIONS.en[key] || key;
  }

  function translatePage() {
    // Translate text content
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = t(els[i].getAttribute('data-i18n'));
    }
    // Translate innerHTML (for elements with HTML content)
    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlEls.length; j++) {
      htmlEls[j].innerHTML = t(htmlEls[j].getAttribute('data-i18n-html'));
    }
    // Translate placeholders
    var phEls = document.querySelectorAll('[data-i18n-placeholder]');
    for (var k = 0; k < phEls.length; k++) {
      phEls[k].placeholder = t(phEls[k].getAttribute('data-i18n-placeholder'));
    }
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('portal_lang', lang);
    $('lang-switcher-label').textContent = lang.toUpperCase();
    // Update active state on options
    var opts = document.querySelectorAll('.lang-option');
    for (var i = 0; i < opts.length; i++) {
      opts[i].classList.toggle('active', opts[i].getAttribute('data-lang') === lang);
    }
    translatePage();
    // Re-render dynamic content for current screen
    if (currentScreen) {
      switch (currentScreen) {
        case 'dashboard': initDashboard(); break;
        case 'deals': renderDeals(); break;
        case 'deal-form': updateTypePills(); updateDayToggles(); updateFormVisibility(); renderInfluencerCodes(); renderGiveawayRecipients(); break;
        case 'posts': renderPosts(); break;
        case 'post-form': updatePostTypePills(); break;
        case 'settings': initSettings(); break;
        case 'restaurant-settings': initRestaurantSettings(); break;
      }
    }
  }

  // Chart colors (matching Flutter)
  var CHART_COLORS = [
    '#007AFF', '#AF52DE', '#34C759', '#FF9500',
    '#FF3B30', '#26A69A', '#FF7043', '#78909C'
  ];

  // Deal types config
  var DEAL_TYPES = [
    { key: 'percent',       labelKey: 'type.percent',       icon: '%' },
    { key: 'fixed',         labelKey: 'type.fixed',         icon: 'CHF' },
    { key: 'bogo',          labelKey: 'type.bogo',          icon: '2x' },
    { key: 'free_item',     labelKey: 'type.free_item',     icon: '&#127873;' },
    { key: 'menu_discount', labelKey: 'type.menu_discount', icon: '&#127860;' },
    { key: 'set_menu',      labelKey: 'type.set_menu',      icon: '&#128214;' },
    { key: 'special_event', labelKey: 'type.special_event', icon: '&#127881;' },
    { key: 'giveaway',      labelKey: 'type.giveaway',      icon: '&#127775;' }
  ];

  var DAY_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  var DAY_KEY_SHORT = ['day.mon', 'day.tue', 'day.wed', 'day.thu', 'day.fri', 'day.sat', 'day.sun'];
  var DAY_KEY_FULL = ['day.monday', 'day.tuesday', 'day.wednesday', 'day.thursday', 'day.friday', 'day.saturday', 'day.sunday'];

  // Form state
  var formState = {
    discountType: 'percent',
    includedItems: [],
    eventDates: [],
    validDays: new Set(),
    cooldownDays: null,
    insiderEnabled: false,
    influencerCodes: [],  // [{id?, instagram_handle, code}]
    giveawayRecipients: []  // [{id?, name, email}]
  };

  // ============================================================
  //  API HELPERS
  // ============================================================
  function getToken() {
    return localStorage.getItem('partner_token');
  }
  function setToken(token) {
    localStorage.setItem('partner_token', token);
  }
  function clearToken() {
    localStorage.removeItem('partner_token');
  }

  async function apiFetch(path, options) {
    var opts = options || {};
    var headers = opts.headers || {};
    var token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (opts.body && typeof opts.body === 'object') {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
    opts.headers = headers;
    var resp = await fetch(API_BASE_URL + path, opts);
    if (resp.status === 401) {
      clearToken();
      partner = null;
      navigate('#login');
      throw new Error('Session expired');
    }
    var data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  // ============================================================
  //  HELPERS
  // ============================================================
  function $(id) { return document.getElementById(id); }
  function show(el) { if (el) el.style.display = ''; }
  function hide(el) { if (el) el.style.display = 'none'; }

  function shortLabel(deal) {
    switch (deal.discount_type) {
      case 'percent': return deal.discount_value + '% off';
      case 'fixed': return 'CHF ' + Math.round(deal.discount_value) + ' off';
      case 'bogo': return 'BOGO';
      case 'free_item': return 'Free item';
      case 'menu_discount': return deal.discount_value + '% off';
      case 'set_menu': return 'CHF ' + (deal.price ? Math.round(deal.price) : '?');
      case 'special_event': return 'Event';
      case 'giveaway': return 'Giveaway';
      default: return 'Deal';
    }
  }

  function validitySummary(deal) {
    var parts = [];
    if (deal.valid_days && deal.valid_days.length > 0) {
      if (deal.valid_days.length <= 2) {
        parts.push(deal.valid_days.map(function (d) { return d.charAt(0).toUpperCase() + d.slice(1); }).join(' & '));
      } else {
        parts.push(deal.valid_days.length + ' days/week');
      }
    }
    if (deal.valid_time_start && deal.valid_time_end) {
      parts.push(deal.valid_time_start.slice(0, 5) + '\u2013' + deal.valid_time_end.slice(0, 5));
    }
    if (deal.valid_until) {
      var diff = Math.ceil((new Date(deal.valid_until) - new Date()) / 86400000);
      if (diff <= 7 && diff >= 0) parts.push((diff + 1) + ' days left');
    }
    return parts.length ? parts.join(' \u00b7 ') : 'Available anytime';
  }

  function avatarHTML(name, photos, size) {
    if (photos && photos.length > 0) {
      return '<img src="' + photos[0] + '" alt="' + (name || '') + '">';
    }
    return (name || '?').charAt(0).toUpperCase();
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function generateInsiderCode() {
    var chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    var code = '';
    for (var i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function copyToClipboard(text, buttonEl) {
    navigator.clipboard.writeText(text).then(function () {
      var original = buttonEl.innerHTML;
      buttonEl.innerHTML = '&#10003;';
      setTimeout(function () { buttonEl.innerHTML = original; }, 1200);
    });
  }

  // ============================================================
  //  ROUTER
  // ============================================================
  function navigate(hash) {
    if (!hash || hash === '#') hash = '#login';
    var route = hash.replace('#', '').split('/')[0];
    var param = hash.indexOf('/') > -1 ? hash.split('/').slice(1).join('/') : null;

    // Auth guard
    if (route !== 'login' && !partner) {
      location.hash = '#login';
      return;
    }
    if (route === 'login' && partner) {
      location.hash = '#dashboard';
      return;
    }

    // Hide all screens
    var screens = document.querySelectorAll('.portal-screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');

    // Toggle nav visibility
    var nav = $('portal-nav');
    if (route === 'login') {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }

    // Close profile dropdown on navigation
    var dropdown = $('profile-dropdown');
    if (dropdown) dropdown.classList.add('hidden');

    // Show target screen
    var screen = $('screen-' + route);
    if (screen) {
      screen.classList.add('active');
      currentScreen = route;
    }

    // Screen init
    switch (route) {
      case 'dashboard': initDashboard(); break;
      case 'deals': initDeals(); break;
      case 'deal-form': initDealForm(param); break;
      case 'posts': initPosts(); break;
      case 'post-form': initPostForm(param); break;
      case 'settings': initSettings(); break;
      case 'restaurant-settings': initRestaurantSettings(); break;
      case 'verify-code': initVerifyCode(); break;
    }
  }

  window.addEventListener('hashchange', function () {
    navigate(location.hash);
  });

  // ============================================================
  //  AUTH
  // ============================================================
  async function checkSession() {
    var token = getToken();
    if (token) {
      try {
        var data = await apiFetch('/partner/me');
        partner = data;
        updateNavProfile();
        navigate(location.hash || '#dashboard');
      } catch (e) {
        clearToken();
        navigate('#login');
      }
    } else {
      navigate('#login');
    }
  }

  // Google Sign-In for partners
  function initGoogleSignIn() {
    if (typeof google === 'undefined' || !google.accounts) {
      // GSI library not loaded yet — retry
      setTimeout(initGoogleSignIn, 200);
      return;
    }
    google.accounts.id.initialize({
      client_id: '522919588868-0rmqil1cpa2fuf27glua50bpb89crjgr.apps.googleusercontent.com',
      callback: handleGoogleCredential,
    });
    google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large', width: 320, text: 'signin_with', shape: 'pill' }
    );
  }

  async function handleGoogleCredential(response) {
    var errorEl = $('google-login-error');
    hide(errorEl);
    try {
      var resp = await fetch(API_BASE_URL + '/partner/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential })
      });
      var data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Google sign-in failed.');

      if (data.status === 'verified') {
        setToken(data.access_token);
        partner = data.partner;
        updateNavProfile();
        location.hash = '#dashboard';
      } else if (data.status === 'pending_verification') {
        errorEl.textContent = t('login.pending_verification') || 'Your account is pending verification. We will contact you soon.';
        show(errorEl);
      } else {
        // no_partner
        errorEl.textContent = t('login.no_partner') || 'No partner account found for this Google account. Contact us at partners@bookedeat.com to register your restaurant.';
        show(errorEl);
      }
    } catch (err) {
      errorEl.textContent = err.message || 'Google sign-in failed.';
      show(errorEl);
    }
  }

  // Login form
  function setupLogin() {
    initGoogleSignIn();
    var form = $('login-form');
    var btn = $('login-btn');
    var toggle = $('password-toggle');

    toggle.addEventListener('click', function () {
      var pw = $('login-password');
      if (pw.type === 'password') {
        pw.type = 'text';
        toggle.textContent = '\u{1F441}\uFE0F';
      } else {
        pw.type = 'password';
        toggle.textContent = '\u{1F441}';
      }
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var email = $('login-email').value.trim();
      var password = $('login-password').value;
      if (!email || !password) return;

      hide($('login-error'));
      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div>';

      try {
        var resp = await fetch(API_BASE_URL + '/partner/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password })
        });
        var data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'Invalid email or password.');

        setToken(data.access_token);
        partner = data.partner;
        updateNavProfile();
        location.hash = '#dashboard';
      } catch (err) {
        showLoginError(err.message || 'Invalid email or password.');
      } finally {
        btn.disabled = false;
        btn.textContent = t('login.submit');
      }
    });
  }

  function showLoginError(msg) {
    var el = $('login-error');
    el.textContent = msg;
    show(el);
  }

  // ============================================================
  //  DASHBOARD
  // ============================================================
  var currentTimeRange = 'all';

  function getDateRange(range) {
    var now = new Date();
    var to = now.toISOString().slice(0, 10);
    var from = null;
    if (range === '7d') {
      from = new Date(now - 7 * 86400000).toISOString().slice(0, 10);
    } else if (range === '30d') {
      from = new Date(now - 30 * 86400000).toISOString().slice(0, 10);
    } else if (range === '90d') {
      from = new Date(now - 90 * 86400000).toISOString().slice(0, 10);
    } else if (range === 'ytd') {
      from = now.getFullYear() + '-01-01';
    }
    return { from: from, to: from ? to : null };
  }

  function buildQueryString(range) {
    var dr = getDateRange(range);
    var qs = '';
    if (dr.from) qs += '?from=' + dr.from + '&to=' + dr.to;
    return qs;
  }

  async function loadDashboardData(range) {
    var qs = buildQueryString(range);

    var results = await Promise.all([
      apiFetch('/partner/dashboard/stats' + qs),
      apiFetch('/partner/deals'),
      apiFetch('/partner/deals/analytics' + qs)
    ]);

    var stats = results[0] || {};
    deals = results[1] || [];
    var analytics = results[2] || [];

    var dailyStats = [];
    try {
      dailyStats = await apiFetch('/partner/analytics/daily-redemptions' + qs);
    } catch (e) { /* ignore */ }

    // Render stats
    $('dash-value-text').textContent = t('dashboard.value_text').replace('{0}', stats.unique_guests || 0);
    $('dash-active-deals').textContent = stats.active_deals || 0;
    $('dash-redemptions').textContent = stats.total_redemptions || 0;
    $('dash-guests').textContent = stats.unique_guests || 0;
    $('dash-deal-count').textContent = t('dashboard.total_deals').replace('{0}', deals.length);

    // Billing card description
    var amountOwed = stats.amount_owed;
    if (typeof amountOwed === 'number' && amountOwed > 0) {
      $('dash-billing-desc').textContent = t('dashboard.outstanding').replace('{0}', amountOwed.toFixed(2));
    } else {
      $('dash-billing-desc').textContent = t('dashboard.view_billing');
    }

    // Charts
    renderPieChart(analytics);
    renderLineChart(dailyStats);
  }

  function setupTimeFilter() {
    var btns = document.querySelectorAll('.time-filter-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentTimeRange = btn.getAttribute('data-range');
        loadDashboardData(currentTimeRange);
      });
    });
  }

  async function initDashboard() {
    if (!partner) return;

    // Set header
    $('dash-avatar').innerHTML = avatarHTML(partner.restaurantName, partner.restaurantPhotos);
    $('dash-name').textContent = partner.restaurantName;

    // Load payment method + trial status for deal creation gate
    try {
      var pmData = await apiFetch('/partner/payment-method');
      if (pmData.has_payment_method) {
        savedPaymentMethod = { brand: pmData.brand, last4: pmData.last4 };
      }
    } catch (e) { /* ignore */ }
    try {
      var limitData = await apiFetch('/partner/spending-limit');
      isInTrial = !!limitData.is_trial;
    } catch (e) { /* ignore */ }

    setupTimeFilter();
    await loadDashboardData(currentTimeRange);
  }

  // ── Opening Hours ──────────────────────────────────────────────
  function getDayLabelsFull() {
    return DAY_KEY_FULL.map(function (k) { return t(k); });
  }
  function getDayLabelsShort() {
    return DAY_KEY_SHORT.map(function (k) { return t(k); });
  }
  var hoursEditing = false;

  function renderOpeningHours(oh) {
    var list = $('hours-list');
    var empty = $('hours-empty');
    var weekdayText = oh && oh.weekday_text ? oh.weekday_text : null;

    if (!weekdayText || weekdayText.length === 0) {
      hide(list);
      show(empty);
      return;
    }

    show(list);
    hide(empty);

    // Today is 0=Sunday in JS, but weekday_text is Monday-first
    var jsDay = new Date().getDay();
    var todayIdx = jsDay === 0 ? 6 : jsDay - 1; // Convert to Mon=0 index

    var html = '';
    for (var i = 0; i < weekdayText.length; i++) {
      var parts = weekdayText[i].split(': ');
      var dayName = parts[0] || getDayLabelsFull()[i];
      var timeStr = parts.slice(1).join(': ') || '';
      var isToday = i === todayIdx;
      html += '<div class="hours-row' + (isToday ? ' today' : '') + '">' +
        '<span class="hours-day">' + escapeHTML(dayName) + (isToday ? ' (' + t('today') + ')' : '') + '</span>' +
        '<span class="hours-time">' + escapeHTML(timeStr) + '</span>' +
        '</div>';
    }
    list.innerHTML = html;
  }

  function setupOpeningHours() {
    $('hours-edit-btn').addEventListener('click', function () {
      if (hoursEditing) return;
      hoursEditing = true;
      hide($('hours-display'));
      show($('hours-edit'));
      $('hours-edit-btn').style.display = 'none';

      var oh = partner.openingHours;
      var weekdayText = oh && oh.weekday_text ? oh.weekday_text : [];

      var html = '';
      for (var i = 0; i < 7; i++) {
        var existing = weekdayText[i] || '';
        var parts = existing.split(': ');
        var timeStr = parts.slice(1).join(': ') || '';
        var isClosed = timeStr.toLowerCase() === 'closed' || timeStr === '';
        var openTime = '';
        var closeTime = '';

        if (!isClosed && timeStr) {
          // Parse "11:00 AM – 10:00 PM" or "11:30–22:00" format
          var timeParts = timeStr.split(/\s*[–\-]\s*/);
          if (timeParts.length === 2) {
            openTime = to24h(timeParts[0].trim());
            closeTime = to24h(timeParts[1].trim());
          }
        }

        html += '<div class="hours-edit-row" data-day="' + i + '">' +
          '<label>' + getDayLabelsShort()[i] + '</label>' +
          '<input type="time" class="hours-open" value="' + openTime + '"' + (isClosed ? ' disabled' : '') + '>' +
          '<span style="color:var(--text-tertiary);font-size:13px;">–</span>' +
          '<input type="time" class="hours-close" value="' + closeTime + '"' + (isClosed ? ' disabled' : '') + '>' +
          '<button type="button" class="hours-closed-toggle' + (isClosed ? ' active' : '') + '">' + t('rs.closed') + '</button>' +
          '</div>';
      }
      $('hours-edit-grid').innerHTML = html;

      // Toggle closed buttons
      var toggles = document.querySelectorAll('.hours-closed-toggle');
      for (var j = 0; j < toggles.length; j++) {
        toggles[j].addEventListener('click', function () {
          this.classList.toggle('active');
          var row = this.closest('.hours-edit-row');
          var inputs = row.querySelectorAll('input[type="time"]');
          var closed = this.classList.contains('active');
          for (var k = 0; k < inputs.length; k++) {
            inputs[k].disabled = closed;
            if (closed) inputs[k].value = '';
          }
        });
      }
    });

    $('hours-cancel-btn').addEventListener('click', function () {
      hoursEditing = false;
      show($('hours-display'));
      hide($('hours-edit'));
      $('hours-edit-btn').style.display = '';
    });

    $('hours-save-btn').addEventListener('click', async function () {
      var rows = document.querySelectorAll('.hours-edit-row');
      var weekdayText = [];
      for (var i = 0; i < rows.length; i++) {
        var dayIdx = parseInt(rows[i].getAttribute('data-day'));
        var closed = rows[i].querySelector('.hours-closed-toggle').classList.contains('active');
        if (closed) {
          weekdayText.push(getDayLabelsFull()[dayIdx] + ': Closed');
        } else {
          var openVal = rows[i].querySelector('.hours-open').value;
          var closeVal = rows[i].querySelector('.hours-close').value;
          if (openVal && closeVal) {
            weekdayText.push(getDayLabelsFull()[dayIdx] + ': ' + formatTime(openVal) + ' \u2013 ' + formatTime(closeVal));
          } else {
            weekdayText.push(getDayLabelsFull()[dayIdx] + ': Closed');
          }
        }
      }

      $('hours-save-btn').disabled = true;
      $('hours-save-btn').textContent = t('rs.saving');
      try {
        var result = await apiFetch('/partner/restaurant/opening-hours', {
          method: 'PATCH',
          body: JSON.stringify({ weekday_text: weekdayText }),
        });
        partner.openingHours = result.openingHours;
        renderOpeningHours(partner.openingHours);
      } catch (e) {
        alert('Failed to save opening hours: ' + (e.message || 'Unknown error'));
      } finally {
        $('hours-save-btn').disabled = false;
        $('hours-save-btn').textContent = t('rs.save');
        hoursEditing = false;
        show($('hours-display'));
        hide($('hours-edit'));
        $('hours-edit-btn').style.display = '';
      }
    });
  }

  function to24h(timeStr) {
    // Convert "9:00 AM", "10:30 PM", etc. to "09:00", "22:30"
    // If already in 24h format like "14:00", return as-is
    if (!timeStr) return '';
    var match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return timeStr.replace(/\s/g, '');
    var h = parseInt(match[1]);
    var m = match[2];
    var ampm = match[3];
    if (ampm) {
      if (ampm.toUpperCase() === 'PM' && h !== 12) h += 12;
      if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
    }
    return (h < 10 ? '0' : '') + h + ':' + m;
  }

  function formatTime(time24) {
    // Format "14:00" as "2:00 PM", "09:30" as "9:30 AM"
    if (!time24) return '';
    var parts = time24.split(':');
    var h = parseInt(parts[0]);
    var m = parts[1];
    var suffix = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12 || 12;
    return h12 + ':' + m + '\u202F' + suffix;
  }

  function renderPieChart(analytics) {
    var withData = analytics.filter(function (a) { return (a.total_redemptions || 0) > 0; });

    if (withData.length === 0) {
      hide($('pie-chart-area'));
      show($('pie-empty'));
      return;
    }
    show($('pie-chart-area'));
    hide($('pie-empty'));

    var labels = withData.map(function (a) { return a.deal_title || 'Deal'; });
    var values = withData.map(function (a) { return a.total_redemptions || 0; });
    var colors = withData.map(function (_, i) { return CHART_COLORS[i % CHART_COLORS.length]; });

    if (pieChart) pieChart.destroy();
    pieChart = new Chart($('pie-chart'), {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        cutout: '55%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });

    // Legend — show top 2, collapse the rest
    var legendHTML = '';
    var VISIBLE_COUNT = 2;
    for (var i = 0; i < withData.length; i++) {
      var hiddenClass = i >= VISIBLE_COUNT ? ' legend-item-hidden' : '';
      legendHTML += '<div class="legend-item' + hiddenClass + '">' +
        '<div class="legend-dot" style="background:' + colors[i] + ';"></div>' +
        '<span class="legend-label">' + escapeHTML(labels[i]) + '</span>' +
        '<span class="legend-value">' + values[i] + '</span>' +
        '</div>';
    }
    if (withData.length > VISIBLE_COUNT) {
      var moreCount = withData.length - VISIBLE_COUNT;
      legendHTML += '<button class="legend-toggle" id="legend-toggle">' +
        '<span class="legend-toggle-text">+' + moreCount + ' ' + t('dashboard.more_deals') + '</span>' +
        '</button>';
    }
    $('pie-legend').innerHTML = legendHTML;

    if (withData.length > VISIBLE_COUNT) {
      $('legend-toggle').addEventListener('click', function () {
        var expanded = $('pie-legend').classList.toggle('legend-expanded');
        var btn = $('legend-toggle');
        if (expanded) {
          btn.querySelector('.legend-toggle-text').textContent = t('dashboard.show_less');
        } else {
          btn.querySelector('.legend-toggle-text').textContent = '+' + moreCount + ' ' + t('dashboard.more_deals');
        }
        // Force Chart.js to recalculate size after legend toggle
        if (pieChart) {
          setTimeout(function () { pieChart.resize(); }, 10);
        }
      });
    }
  }

  function renderLineChart(dailyStats) {
    if (!dailyStats || dailyStats.length === 0) {
      hide($('line-chart-area'));
      show($('line-empty'));
      return;
    }
    show($('line-chart-area'));
    hide($('line-empty'));

    var labels = dailyStats.map(function (s) {
      var d = new Date(s.stat_date);
      return d.getDate() + '/' + (d.getMonth() + 1);
    });
    var values = dailyStats.map(function (s) { return s.redemption_count || 0; });

    if (lineChart) lineChart.destroy();
    lineChart = new Chart($('line-chart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          borderColor: '#007AFF',
          borderWidth: 2.5,
          backgroundColor: function (ctx) {
            var chart = ctx.chart;
            var gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height);
            gradient.addColorStop(0, 'rgba(0, 122, 255, 0.25)');
            gradient.addColorStop(1, 'rgba(0, 122, 255, 0)');
            return gradient;
          },
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHitRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              maxTicksLimit: 5,
              color: 'rgba(0,0,0,0.35)',
              font: { size: 10 }
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: {
              color: 'rgba(0,0,0,0.35)',
              font: { size: 11 },
              precision: 0
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.75)',
            titleFont: { size: 12 },
            bodyFont: { size: 13, weight: 'bold' },
            padding: 8,
            cornerRadius: 8
          }
        }
      }
    });
  }

  // ============================================================
  //  DEALS LIST
  // ============================================================
  var dealsFilter = 'all';

  async function initDeals() {
    show($('deals-loading'));
    hide($('deals-list'));
    hide($('deals-empty'));

    try {
      deals = await apiFetch('/partner/deals');
      console.log('[BookedEat] Loaded', deals.length, 'deals');
    } catch (e) {
      console.error('[BookedEat] Failed to load deals:', e);
      deals = [];
    }
    hide($('deals-loading'));
    try {
      renderDeals();
    } catch (e) {
      console.error('[BookedEat] Failed to render deals:', e);
    }
  }

  function renderDeals() {
    var filtered = deals;
    if (dealsFilter === 'active') filtered = deals.filter(function (d) { return d.is_active; });
    if (dealsFilter === 'inactive') filtered = deals.filter(function (d) { return !d.is_active; });

    if (filtered.length === 0) {
      hide($('deals-list'));
      show($('deals-empty'));
      return;
    }
    hide($('deals-empty'));
    show($('deals-list'));

    var html = '';
    for (var i = 0; i < filtered.length; i++) {
      var d = filtered[i];
      var redemptionText = t('deals.redemptions').replace('{0}', d.current_redemptions) +
        (d.max_redemptions ? ' / ' + d.max_redemptions : '');

      var codeCount = d.influencer_code_count || 0;
      var hasInsider = codeCount > 0 || d.insider_code;

      var isGiveawayDeal = d.discount_type === 'giveaway';

      var badgesHTML = '<div class="deal-badges">' +
        '<span class="deal-badge' + (isGiveawayDeal ? ' giveaway' : '') + '">' + escapeHTML(shortLabel(d)) + '</span>' +
        (hasInsider ? '<span class="deal-badge insider">Insider' + (codeCount > 0 ? ' (' + codeCount + ')' : '') + '</span>' : '') +
        '</div>';

      var insiderRow = '';

      html += '<div class="deal-card" data-id="' + d.id + '">' +
        '<div class="deal-card-top">' +
          badgesHTML +
          '<label class="deal-toggle">' +
            '<input type="checkbox"' + (d.is_active ? ' checked' : '') + ' data-toggle-id="' + d.id + '">' +
            '<span class="deal-toggle-slider"></span>' +
          '</label>' +
        '</div>' +
        '<div class="deal-card-body" data-edit-id="' + d.id + '">' +
          '<div class="deal-card-title">' + escapeHTML(d.title) + '</div>' +
          '<div class="deal-card-validity">' + escapeHTML(validitySummary(d)) + '</div>' +
          '<div class="deal-card-redemptions">' + escapeHTML(redemptionText) + '</div>' +
        '</div>' +
        insiderRow +
        '<div class="deal-card-actions">' +
          '<button class="btn-icon" data-edit-id="' + d.id + '" title="Edit">&#9998;</button>' +
          '<button class="btn-icon danger" data-delete-id="' + d.id + '" title="Delete">&#128465;</button>' +
        '</div>' +
      '</div>';
    }
    $('deals-list').innerHTML = html;

    // Bind toggle events
    var toggles = $('deals-list').querySelectorAll('[data-toggle-id]');
    for (var ti = 0; ti < toggles.length; ti++) {
      toggles[ti].addEventListener('change', handleToggle);
    }
    // Bind edit events
    var edits = $('deals-list').querySelectorAll('[data-edit-id]');
    for (var e = 0; e < edits.length; e++) {
      edits[e].addEventListener('click', function () {
        location.hash = '#deal-form/' + this.getAttribute('data-edit-id');
      });
    }
    // Bind delete events
    var deletes = $('deals-list').querySelectorAll('[data-delete-id]');
    for (var dd = 0; dd < deletes.length; dd++) {
      deletes[dd].addEventListener('click', function (ev) {
        ev.stopPropagation();
        handleDelete(this.getAttribute('data-delete-id'));
      });
    }
  }

  async function handleToggle() {
    var id = this.getAttribute('data-toggle-id');
    try {
      await apiFetch('/partner/deals/' + id + '/toggle', { method: 'PATCH' });
    } catch (e) { /* ignore */ }
    initDeals();
  }

  function handleDelete(id) {
    var deal = deals.find(function (d) { return d.id === id; });
    if (!deal) return;

    $('dialog-title').textContent = t('deals.delete_title');
    $('dialog-message').textContent = t('deals.delete_message').replace('{0}', deal.title);
    $('confirm-dialog').classList.remove('hidden');

    var confirmBtn = $('dialog-confirm');
    var cancelBtn = $('dialog-cancel');

    function cleanup() {
      $('confirm-dialog').classList.add('hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
    }
    async function onConfirm() {
      cleanup();
      try {
        await apiFetch('/partner/deals/' + id, { method: 'DELETE' });
      } catch (e) { /* ignore */ }
      initDeals();
    }
    function onCancel() { cleanup(); }

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
  }

  function setupDealsPage() {
    // Filter chips
    $('deals-filter-chips').addEventListener('click', function (e) {
      var chip = e.target.closest('.filter-chip');
      if (!chip) return;
      dealsFilter = chip.getAttribute('data-filter');
      var chips = $('deals-filter-chips').querySelectorAll('.filter-chip');
      for (var i = 0; i < chips.length; i++) chips[i].classList.remove('active');
      chip.classList.add('active');
      renderDeals();
    });

    $('deals-add-btn').addEventListener('click', function () {
      if (!savedPaymentMethod && !isInTrial) {
        alert(t('deals.payment_required'));
        location.hash = '#settings';
        return;
      }
      location.hash = '#deal-form';
    });
    $('deals-create-first').addEventListener('click', function () {
      if (!savedPaymentMethod && !isInTrial) {
        alert(t('deals.payment_required'));
        location.hash = '#settings';
        return;
      }
      location.hash = '#deal-form';
    });
  }

  // ============================================================
  //  DEAL FORM
  // ============================================================
  async function initDealForm(dealId) {
    editingDealId = dealId || null;
    $('form-title').textContent = editingDealId ? t('form.edit_deal') : t('form.create_deal');
    $('deal-submit-btn').textContent = editingDealId ? t('form.save_changes') : t('form.create_deal');

    // Reset form
    resetForm();

    if (editingDealId) {
      var deal = deals.find(function (d) { return d.id === editingDealId; });
      if (!deal) {
        try {
          deal = await apiFetch('/partner/deals/' + editingDealId);
        } catch (e) { deal = null; }
      }
      if (deal) await populateForm(deal);
    }

    updateFormVisibility();
  }

  function resetForm() {
    $('deal-form').reset();
    formState = {
      discountType: 'percent',
      includedItems: [],
      eventDates: [],
      validDays: new Set(),
      cooldownDays: null,
      insiderEnabled: false,
      influencerCodes: [],
      giveawayRecipients: []
    };
    $('included-items-list').innerHTML = '';
    $('event-date-chips').innerHTML = '';
    $('giveaway-recipients-list').innerHTML = '';
    $('insider-toggle').checked = false;
    hide($('insider-code-section'));
    renderInfluencerCodes();
    renderGiveawayRecipients();
    updateTypePills();
    updateCooldownChips();
    updateDayToggles();
  }

  async function populateForm(deal) {
    formState.discountType = deal.discount_type || 'percent';
    $('deal-title').value = deal.title || '';
    $('deal-description').value = deal.description || '';
    $('deal-discount-value').value = deal.discount_value > 0 ? Math.round(deal.discount_value) : '';
    $('deal-item-description').value = deal.item_description || '';
    $('deal-price').value = deal.price ? Math.round(deal.price) : '';
    $('deal-original-price').value = deal.original_price ? Math.round(deal.original_price) : '';
    $('deal-max-per-user').value = deal.max_per_user || '';
    formState.cooldownDays = deal.cooldown_days || null;

    formState.includedItems = (deal.included_items || []).slice();
    renderIncludedItems();

    formState.eventDates = (deal.event_dates || []).map(function (d) { return new Date(d); });
    renderEventDateChips();

    formState.validDays = new Set(deal.valid_days || []);
    $('deal-valid-from').value = deal.valid_from || '';
    $('deal-valid-until').value = deal.valid_until || '';
    $('deal-time-start').value = (deal.valid_time_start || '').slice(0, 5);
    $('deal-time-end').value = (deal.valid_time_end || '').slice(0, 5);

    // Insider deal — load influencer codes from API
    if (editingDealId) {
      try {
        var codes = await apiFetch('/partner/deals/' + editingDealId + '/influencer-codes');
        formState.influencerCodes = codes || [];
      } catch (e) {
        formState.influencerCodes = [];
      }
    }
    if (formState.influencerCodes.length > 0 || deal.insider_code) {
      formState.insiderEnabled = true;
      $('insider-toggle').checked = true;
      show($('insider-code-section'));
    }
    renderInfluencerCodes();

    // Load giveaway recipients
    if (editingDealId && deal.discount_type === 'giveaway') {
      try {
        var recipients = await apiFetch('/partner/deals/' + editingDealId + '/giveaway-grants');
        formState.giveawayRecipients = recipients || [];
      } catch (e) {
        formState.giveawayRecipients = [];
      }
    }
    renderGiveawayRecipients();

    updateTypePills();
    updateCooldownChips();
    updateDayToggles();
    updateFormVisibility();
  }

  // Type visibility rules
  function showDiscountValue() {
    return ['percent', 'fixed', 'menu_discount'].indexOf(formState.discountType) > -1;
  }
  function showItemDescription() {
    return ['bogo', 'free_item', 'menu_discount'].indexOf(formState.discountType) > -1;
  }
  function showPrice() {
    return ['set_menu', 'special_event'].indexOf(formState.discountType) > -1;
  }
  function showIncludedItems() {
    return ['set_menu', 'special_event'].indexOf(formState.discountType) > -1;
  }
  function isEvent() {
    return formState.discountType === 'special_event';
  }
  function isGiveaway() {
    return formState.discountType === 'giveaway';
  }

  function updateFormVisibility() {
    var type = formState.discountType;

    // Discount value
    if (showDiscountValue()) {
      show($('field-discount-value'));
      $('discount-value-label').textContent = type === 'fixed' ? t('form.amount_chf') : t('form.percentage');
    } else {
      hide($('field-discount-value'));
    }

    // Item description
    if (showItemDescription()) {
      show($('field-item-description'));
      var lbl = type === 'bogo' ? t('form.item_bogo') :
                type === 'free_item' ? t('form.item_free') :
                t('form.item_menu');
      $('item-description-label').textContent = lbl;
    } else {
      hide($('field-item-description'));
    }

    // Pricing
    if (showPrice()) {
      show($('field-pricing'));
      $('pricing-label').textContent = isEvent() ? t('form.event_pricing') : t('form.menu_pricing');
    } else {
      hide($('field-pricing'));
    }

    // Included items
    showIncludedItems() ? show($('field-included-items')) : hide($('field-included-items'));

    // Cooldown
    !isEvent() ? show($('field-cooldown')) : hide($('field-cooldown'));

    // Schedule vs Event dates vs Giveaway
    if (isGiveaway()) {
      hide($('field-schedule'));
      hide($('field-event-dates'));
    } else if (isEvent()) {
      hide($('field-schedule'));
      show($('field-event-dates'));
      renderCalendar();
    } else {
      show($('field-schedule'));
      hide($('field-event-dates'));
    }

    // Giveaway recipients
    isGiveaway() ? show($('giveaway-section')) : hide($('giveaway-section'));

    // Insider deal (hide for giveaways)
    var insiderPanel = $('insider-panel');
    if (insiderPanel) {
      isGiveaway() ? hide(insiderPanel) : show(insiderPanel);
    }
  }

  // Type pills
  function updateTypePills() {
    var html = '';
    for (var i = 0; i < DEAL_TYPES.length; i++) {
      var dt = DEAL_TYPES[i];
      var sel = formState.discountType === dt.key;
      html += '<button type="button" class="type-pill' + (sel ? ' active' : '') + '" data-type="' + dt.key + '">' +
        '<span class="type-pill-icon">' + dt.icon + '</span>' +
        escapeHTML(t(dt.labelKey)) +
      '</button>';
    }
    $('deal-type-pills').innerHTML = html;
  }

  // Cooldown chips
  function updateCooldownChips() {
    var chips = $('cooldown-chips').querySelectorAll('.cooldown-chip');
    for (var i = 0; i < chips.length; i++) {
      var val = chips[i].getAttribute('data-value');
      var match = (val === '' && formState.cooldownDays === null) ||
                  (val !== '' && parseInt(val) === formState.cooldownDays);
      chips[i].classList.toggle('active', match);
    }
  }

  // Day toggles
  function updateDayToggles() {
    var html = '';
    for (var i = 0; i < DAY_NAMES.length; i++) {
      var sel = formState.validDays.has(DAY_NAMES[i]);
      html += '<button type="button" class="day-toggle' + (sel ? ' active' : '') + '" data-day="' + DAY_NAMES[i] + '">' +
        getDayLabelsShort()[i] + '</button>';
    }
    $('day-toggles').innerHTML = html;
  }

  // Included items
  function renderIncludedItems() {
    var html = '';
    for (var i = 0; i < formState.includedItems.length; i++) {
      html += '<div class="included-item">' +
        '<span class="included-item-check">&#10004;</span>' +
        '<span class="included-item-text">' + escapeHTML(formState.includedItems[i]) + '</span>' +
        '<button type="button" class="included-item-remove" data-idx="' + i + '">&#10005;</button>' +
      '</div>';
    }
    $('included-items-list').innerHTML = html;

    // Bind remove
    var removes = $('included-items-list').querySelectorAll('[data-idx]');
    for (var j = 0; j < removes.length; j++) {
      removes[j].addEventListener('click', function () {
        formState.includedItems.splice(parseInt(this.getAttribute('data-idx')), 1);
        renderIncludedItems();
      });
    }
  }

  // Calendar for event dates
  var calendarMonth = new Date().getMonth();
  var calendarYear = new Date().getFullYear();

  function renderCalendar() {
    var cal = $('event-calendar');
    var firstDay = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=Sun
    var daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var monthName = t('month.' + calendarMonth);

    var html = '<div class="calendar">' +
      '<div class="calendar-header">' +
        '<button type="button" class="calendar-nav" id="cal-prev">&#8249;</button>' +
        '<span class="calendar-title">' + monthName + ' ' + calendarYear + '</span>' +
        '<button type="button" class="calendar-nav" id="cal-next">&#8250;</button>' +
      '</div>' +
      '<div class="calendar-grid">';

    var weekdays = [t('cal.su'), t('cal.mo'), t('cal.tu'), t('cal.we'), t('cal.th'), t('cal.fr'), t('cal.sa')];
    for (var w = 0; w < 7; w++) {
      html += '<div class="calendar-weekday">' + weekdays[w] + '</div>';
    }

    // Empty cells before first day
    for (var e = 0; e < firstDay; e++) {
      html += '<div class="calendar-day empty"></div>';
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(calendarYear, calendarMonth, d);
      var isPast = date < today;
      var isSelected = formState.eventDates.some(function (ed) {
        return ed.getFullYear() === date.getFullYear() &&
               ed.getMonth() === date.getMonth() &&
               ed.getDate() === date.getDate();
      });
      var cls = 'calendar-day';
      if (isPast) cls += ' disabled';
      if (isSelected) cls += ' selected';
      html += '<button type="button" class="' + cls + '" data-date="' + calendarYear + '-' +
        String(calendarMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0') + '">' + d + '</button>';
    }

    html += '</div></div>';
    cal.innerHTML = html;

    // Bind events
    $('cal-prev').addEventListener('click', function () {
      calendarMonth--;
      if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
      renderCalendar();
    });
    $('cal-next').addEventListener('click', function () {
      calendarMonth++;
      if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
      renderCalendar();
    });

    var dayBtns = cal.querySelectorAll('.calendar-day:not(.disabled):not(.empty)');
    for (var b = 0; b < dayBtns.length; b++) {
      dayBtns[b].addEventListener('click', function () {
        var dateStr = this.getAttribute('data-date');
        var dateObj = new Date(dateStr + 'T00:00:00');
        var idx = formState.eventDates.findIndex(function (ed) {
          return ed.getFullYear() === dateObj.getFullYear() &&
                 ed.getMonth() === dateObj.getMonth() &&
                 ed.getDate() === dateObj.getDate();
        });
        if (idx > -1) {
          formState.eventDates.splice(idx, 1);
        } else {
          formState.eventDates.push(dateObj);
        }
        formState.eventDates.sort(function (a, b) { return a - b; });
        renderCalendar();
        renderEventDateChips();
      });
    }
  }

  function renderEventDateChips() {
    var html = '';
    for (var i = 0; i < formState.eventDates.length; i++) {
      var d = formState.eventDates[i];
      html += '<span class="event-date-chip">' +
        d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() +
        ' <button type="button" data-remove-date="' + i + '">&#10005;</button></span>';
    }
    $('event-date-chips').innerHTML = html;

    var removeBtns = $('event-date-chips').querySelectorAll('[data-remove-date]');
    for (var j = 0; j < removeBtns.length; j++) {
      removeBtns[j].addEventListener('click', function () {
        formState.eventDates.splice(parseInt(this.getAttribute('data-remove-date')), 1);
        renderCalendar();
        renderEventDateChips();
      });
    }
  }

  // Influencer codes list
  function renderInfluencerCodes() {
    var list = $('influencer-codes-list');
    if (!list) return;

    if (formState.influencerCodes.length === 0) {
      list.innerHTML = '<div class="influencer-codes-empty">' + escapeHTML(t('form.no_codes')) + '</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < formState.influencerCodes.length; i++) {
      var c = formState.influencerCodes[i];
      var rate = parseFloat(c.compensation_rate) || 0;
      var rateLabel = rate > 0
        ? ' \u2014 CHF ' + rate.toFixed(2) + (c.compensation_type === 'fixed' ? ' fixed' : '/unlock')
        : '';
      html += '<div class="influencer-code-row">' +
        '<span class="influencer-handle">@' + escapeHTML(c.instagram_handle) + '</span>' +
        '<span class="influencer-code-value">' + escapeHTML(c.code) + escapeHTML(rateLabel) + '</span>' +
        '<button type="button" class="copy-btn" data-copy-code="' + escapeHTML(c.code) + '" title="Copy code">&#128203;</button>' +
        '<button type="button" class="btn-icon danger influencer-delete-btn" data-inf-idx="' + i + '" title="Remove">&#10005;</button>' +
      '</div>';
    }
    list.innerHTML = html;

    // Bind copy
    var copyBtns = list.querySelectorAll('[data-copy-code]');
    for (var cc = 0; cc < copyBtns.length; cc++) {
      copyBtns[cc].addEventListener('click', function (ev) {
        ev.stopPropagation();
        copyToClipboard(this.getAttribute('data-copy-code'), this);
      });
    }

    // Bind delete
    var delBtns = list.querySelectorAll('[data-inf-idx]');
    for (var dd = 0; dd < delBtns.length; dd++) {
      delBtns[dd].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-inf-idx'));
        handleDeleteInfluencerCode(idx);
      });
    }
  }

  async function handleDeleteInfluencerCode(idx) {
    var code = formState.influencerCodes[idx];
    if (!code) return;

    // If editing existing deal and code has an id, delete via API
    if (editingDealId && code.id) {
      try {
        await apiFetch('/partner/deals/' + editingDealId + '/influencer-codes/' + code.id, { method: 'DELETE' });
      } catch (e) {
        alert('Failed to delete code: ' + (e.message || e));
        return;
      }
    }
    formState.influencerCodes.splice(idx, 1);
    renderInfluencerCodes();
  }

  // Influencer handle autocomplete
  var acTimer = null;
  var acResults = [];

  function setupHandleAutocomplete() {
    var input = $('new-influencer-handle');
    var dropdown = $('handle-autocomplete');

    input.addEventListener('input', function () {
      var q = this.value.trim().replace(/^@/, '');
      if (acTimer) clearTimeout(acTimer);
      if (q.length < 1) { hideAutocomplete(); return; }
      acTimer = setTimeout(function () { fetchHandleSuggestions(q); }, 200);
    });

    input.addEventListener('focus', function () {
      var q = this.value.trim().replace(/^@/, '');
      if (q.length >= 1 && acResults.length > 0) showAutocomplete();
    });

    // Hide on click outside
    document.addEventListener('click', function (e) {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        hideAutocomplete();
      }
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideAutocomplete();
      if (e.key === 'ArrowDown' && dropdown.style.display !== 'none') {
        e.preventDefault();
        var first = dropdown.querySelector('.ac-item');
        if (first) first.focus();
      }
    });
  }

  async function fetchHandleSuggestions(q) {
    try {
      acResults = await apiFetch('/partner/influencer-handles?q=' + encodeURIComponent(q));
    } catch (e) {
      acResults = [];
    }
    if (acResults.length > 0) {
      renderAutocomplete(acResults);
      showAutocomplete();
    } else {
      hideAutocomplete();
    }
  }

  function renderAutocomplete(handles) {
    var dropdown = $('handle-autocomplete');
    var html = '';
    for (var i = 0; i < handles.length; i++) {
      html += '<button type="button" class="ac-item" data-handle="' + escapeHTML(handles[i]) + '">@' + escapeHTML(handles[i]) + '</button>';
    }
    dropdown.innerHTML = html;

    var items = dropdown.querySelectorAll('.ac-item');
    for (var j = 0; j < items.length; j++) {
      items[j].addEventListener('click', function () {
        $('new-influencer-handle').value = '@' + this.getAttribute('data-handle');
        hideAutocomplete();
        $('new-influencer-code').focus();
      });
      items[j].addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.nextElementSibling) this.nextElementSibling.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.previousElementSibling) this.previousElementSibling.focus();
          else $('new-influencer-handle').focus();
        } else if (e.key === 'Escape') {
          hideAutocomplete();
          $('new-influencer-handle').focus();
        }
      });
    }
  }

  function showAutocomplete() {
    $('handle-autocomplete').style.display = 'block';
  }
  function hideAutocomplete() {
    $('handle-autocomplete').style.display = 'none';
  }

  async function handleAddInfluencerCode() {
    var handleInput = $('new-influencer-handle');
    var codeInput = $('new-influencer-code');
    var rateInput = $('new-influencer-rate');
    var typeSelect = $('new-influencer-comp-type');
    var handle = handleInput.value.trim().replace(/^@/, '');
    var code = codeInput.value.trim().toUpperCase();
    var rate = rateInput ? parseFloat(rateInput.value) || 0 : 0;
    var compType = typeSelect ? typeSelect.value : 'per_unlock';

    if (!handle) { handleInput.focus(); return; }
    if (code.length < 4) { codeInput.focus(); return; }

    // Check for duplicate handle in current list
    var dupHandle = formState.influencerCodes.some(function (c) {
      return c.instagram_handle.toLowerCase() === handle.toLowerCase();
    });
    if (dupHandle) {
      alert('This influencer already has a code for this deal.');
      return;
    }

    var payload = {
      instagram_handle: handle,
      code: code,
      compensation_rate: rate,
      compensation_type: compType
    };

    if (editingDealId) {
      // Save immediately via API
      try {
        var created = await apiFetch('/partner/deals/' + editingDealId + '/influencer-codes', {
          method: 'POST',
          body: payload
        });
        formState.influencerCodes.push(created);
      } catch (e) {
        alert('Failed to add code: ' + (e.message || e));
        return;
      }
    } else {
      // Buffer for new deal
      formState.influencerCodes.push(payload);
    }

    handleInput.value = '';
    codeInput.value = '';
    if (rateInput) rateInput.value = '';
    renderInfluencerCodes();
  }

  function setupDealForm() {
    // Back button
    $('form-back-btn').addEventListener('click', function () {
      location.hash = '#deals';
    });

    // Type pills
    $('deal-type-pills').addEventListener('click', function (e) {
      var pill = e.target.closest('.type-pill');
      if (!pill) return;
      formState.discountType = pill.getAttribute('data-type');
      updateTypePills();
      updateFormVisibility();
    });

    // Cooldown chips
    $('cooldown-chips').addEventListener('click', function (e) {
      var chip = e.target.closest('.cooldown-chip');
      if (!chip) return;
      var val = chip.getAttribute('data-value');
      formState.cooldownDays = val === '' ? null : parseInt(val);
      updateCooldownChips();
    });

    // Day toggles
    $('day-toggles').addEventListener('click', function (e) {
      var btn = e.target.closest('.day-toggle');
      if (!btn) return;
      var day = btn.getAttribute('data-day');
      if (formState.validDays.has(day)) {
        formState.validDays.delete(day);
      } else {
        formState.validDays.add(day);
      }
      updateDayToggles();
    });

    // Add included item
    $('add-item-btn').addEventListener('click', addIncludedItem);
    $('new-item-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); addIncludedItem(); }
    });

    // Insider deal toggle
    $('insider-toggle').addEventListener('change', function () {
      formState.insiderEnabled = this.checked;
      if (this.checked) {
        show($('insider-code-section'));
        renderInfluencerCodes();
      } else {
        hide($('insider-code-section'));
      }
    });

    // Add influencer code
    $('add-influencer-btn').addEventListener('click', function () {
      handleAddInfluencerCode();
    });
    $('new-influencer-code').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); handleAddInfluencerCode(); }
    });

    // Generate code button
    $('influencer-generate-btn').addEventListener('click', function () {
      $('new-influencer-code').value = generateInsiderCode();
    });

    // Uppercase the code input
    $('new-influencer-code').addEventListener('input', function () {
      this.value = this.value.toUpperCase().replace(/[^A-Z0-9_]/g, '');
    });

    // Giveaway recipients
    $('add-giveaway-btn').addEventListener('click', function () {
      handleAddGiveawayRecipient();
    });
    $('giveaway-email').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); handleAddGiveawayRecipient(); }
    });

    // Handle autocomplete
    setupHandleAutocomplete();

    // Submit
    $('deal-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      await handleDealSubmit();
    });
  }

  function addIncludedItem() {
    var input = $('new-item-input');
    var val = input.value.trim();
    if (!val) return;
    formState.includedItems.push(val);
    input.value = '';
    renderIncludedItems();
  }

  async function handleDealSubmit() {
    var title = $('deal-title').value.trim();
    if (!title) {
      $('deal-title').focus();
      return;
    }

    var type = formState.discountType;
    var discountValue = showDiscountValue() ? (parseFloat($('deal-discount-value').value) || 0) : 0;

    // Validation
    if (showDiscountValue() && discountValue <= 0) {
      $('deal-discount-value').focus();
      return;
    }
    if (type === 'percent' && discountValue > 100) {
      $('deal-discount-value').focus();
      return;
    }
    if (showPrice() && !parseFloat($('deal-price').value)) {
      $('deal-price').focus();
      return;
    }
    if (isGiveaway() && formState.giveawayRecipients.length === 0) {
      $('giveaway-name').focus();
      return;
    }
    if (formState.insiderEnabled && !isGiveaway() && formState.influencerCodes.length === 0) {
      $('new-influencer-handle').focus();
      return;
    }

    var btn = $('deal-submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';

    var data = {
      title: title,
      description: $('deal-description').value.trim() || null,
      discount_type: type,
      discount_value: discountValue,
      eligibility: 'all',
      max_per_user: $('deal-max-per-user').value ? parseInt($('deal-max-per-user').value) : null,
      cooldown_days: !isEvent() ? formState.cooldownDays : null,
      item_description: showItemDescription() && $('deal-item-description').value.trim()
        ? $('deal-item-description').value.trim() : null,
      price: showPrice() ? parseFloat($('deal-price').value) || null : null,
      original_price: showPrice() && $('deal-original-price').value
        ? parseFloat($('deal-original-price').value) : null,
      included_items: showIncludedItems() ? formState.includedItems : [],
      event_dates: isEvent() ? formState.eventDates.map(function (d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
          String(d.getDate()).padStart(2, '0');
      }) : [],
      valid_days: !isEvent() && !isGiveaway() ? Array.from(formState.validDays) : [],
      valid_from: !isEvent() && !isGiveaway() && $('deal-valid-from').value ? $('deal-valid-from').value : null,
      valid_until: !isEvent() && !isGiveaway() && $('deal-valid-until').value ? $('deal-valid-until').value : null,
      valid_time_start: !isEvent() && !isGiveaway() && $('deal-time-start').value ? $('deal-time-start').value : null,
      valid_time_end: !isEvent() && !isGiveaway() && $('deal-time-end').value ? $('deal-time-end').value : null,
      is_active: true
    };

    try {
      if (editingDealId) {
        await apiFetch('/partner/deals/' + editingDealId, { method: 'PATCH', body: data });
      } else {
        var created = await apiFetch('/partner/deals', { method: 'POST', body: data });
        // Post buffered influencer codes for new deal
        if (formState.influencerCodes.length > 0 && created && created.id) {
          for (var ci = 0; ci < formState.influencerCodes.length; ci++) {
            var ic = formState.influencerCodes[ci];
            await apiFetch('/partner/deals/' + created.id + '/influencer-codes', {
              method: 'POST',
              body: { instagram_handle: ic.instagram_handle, code: ic.code }
            });
          }
        }
        // Post buffered giveaway recipients for new deal
        if (formState.giveawayRecipients.length > 0 && created && created.id) {
          for (var gi = 0; gi < formState.giveawayRecipients.length; gi++) {
            var gr = formState.giveawayRecipients[gi];
            await apiFetch('/partner/deals/' + created.id + '/giveaway-grants', {
              method: 'POST',
              body: { name: gr.name, email: gr.email }
            });
          }
        }
      }
      location.hash = '#deals';
    } catch (err) {
      var msg = err.message || String(err);
      alert('Failed to save deal: ' + msg);
    } finally {
      btn.disabled = false;
      btn.textContent = editingDealId ? t('form.save_changes') : t('form.create_deal');
    }
  }

  // ============================================================
  //  GIVEAWAY RECIPIENTS
  // ============================================================
  function renderGiveawayRecipients() {
    var list = $('giveaway-recipients-list');
    if (!list) return;

    if (formState.giveawayRecipients.length === 0) {
      list.innerHTML = '<div class="giveaway-recipients-empty">' + escapeHTML(t('form.no_recipients')) + '</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < formState.giveawayRecipients.length; i++) {
      var r = formState.giveawayRecipients[i];
      html += '<div class="giveaway-recipient-row">' +
        '<span class="giveaway-recipient-name">' + escapeHTML(r.name) + '</span>' +
        '<span class="giveaway-recipient-email">' + escapeHTML(r.email) + '</span>' +
        '<button type="button" class="btn-icon danger giveaway-remove-btn" data-giveaway-idx="' + i + '" title="Remove">&#10005;</button>' +
      '</div>';
    }
    list.innerHTML = html;

    // Bind remove
    var removeBtns = list.querySelectorAll('[data-giveaway-idx]');
    for (var j = 0; j < removeBtns.length; j++) {
      removeBtns[j].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-giveaway-idx'));
        handleRemoveGiveawayRecipient(idx);
      });
    }
  }

  async function handleRemoveGiveawayRecipient(idx) {
    var recipient = formState.giveawayRecipients[idx];
    if (!recipient) return;

    if (editingDealId && recipient.id) {
      try {
        await apiFetch('/partner/deals/' + editingDealId + '/giveaway-grants/' + recipient.id, { method: 'DELETE' });
      } catch (e) {
        alert('Failed to remove recipient: ' + (e.message || e));
        return;
      }
    }
    formState.giveawayRecipients.splice(idx, 1);
    renderGiveawayRecipients();
  }

  async function handleAddGiveawayRecipient() {
    var nameInput = $('giveaway-name');
    var emailInput = $('giveaway-email');
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();

    if (!name) { nameInput.focus(); return; }
    if (!email || !email.includes('@')) { emailInput.focus(); return; }

    // Check for duplicate email
    var dupEmail = formState.giveawayRecipients.some(function (r) {
      return r.email.toLowerCase() === email.toLowerCase();
    });
    if (dupEmail) {
      alert('This email has already been granted this giveaway.');
      return;
    }

    var payload = { name: name, email: email };

    if (editingDealId) {
      try {
        var created = await apiFetch('/partner/deals/' + editingDealId + '/giveaway-grants', {
          method: 'POST',
          body: payload
        });
        formState.giveawayRecipients.push(created);
      } catch (e) {
        alert('Failed to grant giveaway: ' + (e.message || e));
        return;
      }
    } else {
      formState.giveawayRecipients.push(payload);
    }

    nameInput.value = '';
    emailInput.value = '';
    renderGiveawayRecipients();
  }

  // ============================================================
  //  RESTAURANT SETTINGS
  // ============================================================
  function initRestaurantSettings() {
    if (!partner) return;

    $('rs-avatar').innerHTML = avatarHTML(partner.restaurantName, partner.restaurantPhotos);
    $('rs-name').textContent = partner.restaurantName;
    $('rs-address').textContent = partner.restaurantAddress || '';

    // Pre-fill contact info from partner data
    $('rs-phone').value = partner.restaurantPhone || '';
    $('rs-website').value = partner.restaurantWebsite || '';
    $('rs-contact-status').textContent = '';

    // Render opening hours
    renderOpeningHours(partner.openingHours);
  }

  function setupRestaurantSettings() {
    $('rs-contact-save').addEventListener('click', async function () {
      var phone = $('rs-phone').value.trim();
      var website = $('rs-website').value.trim();
      var btn = $('rs-contact-save');
      var status = $('rs-contact-status');

      btn.disabled = true;
      btn.textContent = t('rs.saving');
      status.textContent = '';

      try {
        var result = await apiFetch('/partner/restaurant/contact', {
          method: 'PATCH',
          body: { phone: phone, website: website }
        });
        partner.restaurantPhone = phone;
        partner.restaurantWebsite = website;
        status.textContent = t('rs.saved');
        status.style.color = 'var(--green-500)';
        setTimeout(function () { status.textContent = ''; }, 2000);
      } catch (e) {
        status.textContent = t('rs.failed');
        status.style.color = 'var(--red-500)';
      } finally {
        btn.disabled = false;
        btn.textContent = t('rs.save');
      }
    });
  }

  // ============================================================
  //  SETTINGS (Billing)
  // ============================================================
  // ── Stripe & Payment Method ────────────────────────────────
  var stripe = null;
  var cardElement = null;
  var stripeInitialized = false;
  var savedPaymentMethod = null; // { brand, last4 }
  var isInTrial = false;

  // Example past receipt (February 2026)
  var pastReceipts = [
    {
      id: 'REC-2026-02',
      monthKey: 1, // February (0-indexed)
      year: 2026,
      date: '2026-03-01',
      periodStart: '1 Feb 2026',
      periodEnd: '28 Feb 2026',
      redemptions: 40,
      total: 20.00,
      paymentMethod: 'Visa \u2022\u2022\u2022\u2022 4242',
      status: 'paid'
    }
  ];

  function initStripe() {
    if (stripeInitialized) return;
    stripeInitialized = true;

    try {
      stripe = Stripe('pk_test_51TFbwfEACmd1kHXfwdxAyvGOS7frn4jOHNKzLJXHPaufyCf3Y6QTAzburK6JmDAUiruiBRb1d0RCd3MLFYSXJhUK006HPwBx9r');
    } catch (e) {
      // Stripe.js failed to load (e.g. offline)
      $('stripe-card-form').innerHTML = '<div class="no-payment-method">Stripe could not be loaded. Please check your connection.</div>';
      return;
    }

    var elements = stripe.elements();
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '14px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          color: 'rgba(0,0,0,0.85)',
          '::placeholder': { color: 'rgba(0,0,0,0.35)' }
        },
        invalid: { color: '#FF3B30' }
      }
    });
    cardElement.mount('#stripe-card-element');

    cardElement.on('change', function (event) {
      $('card-errors').textContent = event.error ? event.error.message : '';
      $('save-card-btn').disabled = !event.complete;
    });

    $('save-card-btn').addEventListener('click', async function () {
      var btn = $('save-card-btn');
      btn.disabled = true;
      btn.textContent = t('billing.saving_card');

      var result = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

      if (result.error) {
        $('card-errors').textContent = result.error.message;
        btn.disabled = false;
        btn.textContent = t('billing.save_card');
      } else {
        var pm = result.paymentMethod;
        try {
          await apiFetch('/partner/payment-method', {
            method: 'PATCH',
            body: { payment_method_id: pm.id }
          });
          savedPaymentMethod = {
            brand: pm.card.brand,
            last4: pm.card.last4
          };
          renderPaymentMethod();
        } catch (e) {
          $('card-errors').textContent = e.message || 'Failed to save card.';
          btn.disabled = false;
          btn.textContent = t('billing.save_card');
        }
      }
    });
  }

  function brandIcon(brand) {
    switch ((brand || '').toLowerCase()) {
      case 'visa': return '\uD83D\uDCB3';
      case 'mastercard': return '\uD83D\uDCB3';
      case 'amex': return '\uD83D\uDCB3';
      default: return '\uD83D\uDCB3';
    }
  }

  function brandLabel(brand) {
    switch ((brand || '').toLowerCase()) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'Mastercard';
      case 'amex': return 'Amex';
      default: return brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : 'Card';
    }
  }

  function renderPaymentMethod() {
    var display = $('payment-method-display');
    var form = $('stripe-card-form');

    if (savedPaymentMethod) {
      display.innerHTML =
        '<div class="payment-method-saved">' +
          '<div class="payment-method-info">' +
            '<span class="payment-method-card-icon">' + brandIcon(savedPaymentMethod.brand) + '</span>' +
            '<span class="payment-method-text">' + brandLabel(savedPaymentMethod.brand) + ' \u2022\u2022\u2022\u2022 ' + savedPaymentMethod.last4 + '</span>' +
          '</div>' +
          '<div class="payment-method-actions">' +
            '<button class="pm-change" id="pm-change-btn">' + t('billing.change_card') + '</button>' +
            '<button class="pm-remove" id="pm-remove-btn">' + t('billing.remove_card') + '</button>' +
          '</div>' +
        '</div>';
      hide(form);

      $('pm-change-btn').addEventListener('click', function () {
        show(form);
        $('save-card-btn').textContent = t('billing.save_card');
        $('save-card-btn').disabled = true;
        if (cardElement) cardElement.clear();
      });
      $('pm-remove-btn').addEventListener('click', async function () {
        try {
          await apiFetch('/partner/payment-method', { method: 'DELETE' });
        } catch (e) { /* best-effort */ }
        savedPaymentMethod = null;
        renderPaymentMethod();
      });
    } else {
      display.innerHTML = '<div class="no-payment-method">' + t('billing.no_payment_method') + '</div>';
      show(form);
      $('save-card-btn').textContent = t('billing.save_card');
      $('save-card-btn').disabled = true;
    }
  }

  function renderReceipts() {
    var list = $('receipts-list');
    if (pastReceipts.length === 0) {
      list.innerHTML = '<div class="receipts-empty">' + escapeHTML(t('billing.no_receipts')) + '</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < pastReceipts.length; i++) {
      var r = pastReceipts[i];
      var monthLabel = t('month.' + r.monthKey) + ' ' + r.year;
      var detailText = t('billing.receipt_redemptions').replace('{0}', r.redemptions) +
        ' \u2022 ' + t('billing.receipt_paid_with').replace('{0}', r.paymentMethod);
      var statusLabel = r.status === 'paid' ? t('billing.paid') : t('billing.pending');

      html += '<div class="receipt-row">' +
        '<div class="receipt-info">' +
          '<div class="receipt-month">' + escapeHTML(monthLabel) + '</div>' +
          '<div class="receipt-detail">' + escapeHTML(detailText) + '</div>' +
        '</div>' +
        '<div class="receipt-right">' +
          '<span class="receipt-status ' + r.status + '">' + statusLabel + '</span>' +
          '<span class="receipt-amount">CHF ' + r.total.toFixed(2) + '</span>' +
          '<button class="receipt-download-btn" data-receipt-idx="' + i + '">' + t('billing.download') + '</button>' +
        '</div>' +
      '</div>';
    }
    list.innerHTML = html;

    // Bind download buttons
    var btns = list.querySelectorAll('[data-receipt-idx]');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-receipt-idx'));
        downloadReceipt(pastReceipts[idx]);
      });
    }
  }

  function generateReceiptHTML(r) {
    var restaurantName = partner ? partner.restaurantName : 'Restaurant';
    var restaurantAddr = partner ? (partner.restaurantAddress || '') : '';
    var monthLabel = t('month.' + r.monthKey) + ' ' + r.year;
    var lineDetail = t('billing.receipt_line_detail').replace('{0}', r.redemptions);

    return '<!DOCTYPE html>' +
      '<html><head><meta charset="UTF-8"><title>BookedEat ' + t('billing.receipt_title') + ' ' + r.id + '</title>' +
      '<style>' +
        'body{font-family:Inter,-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;max-width:600px;margin:40px auto;padding:0 24px;color:#1a1a1a;font-size:14px;line-height:1.6;}' +
        '.logo{font-size:22px;font-weight:700;margin-bottom:4px;}' +
        '.logo span{color:#007AFF;}' +
        '.subtitle{color:#888;font-size:13px;margin-bottom:32px;}' +
        'h1{font-size:20px;font-weight:700;margin:0 0 24px;}' +
        '.meta{display:grid;grid-template-columns:140px 1fr;gap:6px 16px;margin-bottom:28px;font-size:13px;}' +
        '.meta-label{color:#888;font-weight:500;}' +
        'table{width:100%;border-collapse:collapse;margin-bottom:24px;}' +
        'th{text-align:left;border-bottom:2px solid #e0e0e0;padding:8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;}' +
        'th:last-child{text-align:right;}' +
        'td{padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;}' +
        'td:last-child{text-align:right;font-variant-numeric:tabular-nums;}' +
        '.item-detail{font-size:12px;color:#888;margin-top:2px;}' +
        '.total-row td{border-bottom:2px solid #1a1a1a;font-weight:700;font-size:15px;}' +
        '.payment-section{margin-top:24px;padding:16px;background:#f8f8f8;border-radius:8px;font-size:13px;}' +
        '.payment-section div{display:flex;justify-content:space-between;padding:3px 0;}' +
        '.thank-you{margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0;font-size:13px;color:#888;text-align:center;}' +
        '.company{text-align:center;font-size:11px;color:#aaa;margin-top:8px;}' +
        '@media print{body{margin:0;padding:20px;}}' +
      '</style></head><body>' +
      '<div class="logo">Booked<span>Eat</span></div>' +
      '<div class="subtitle">Restaurant Partner Platform</div>' +
      '<h1>' + t('billing.receipt_title') + '</h1>' +
      '<div class="meta">' +
        '<span class="meta-label">' + t('billing.receipt_number') + '</span><span>' + r.id + '</span>' +
        '<span class="meta-label">' + t('billing.receipt_date') + '</span><span>' + r.date + '</span>' +
        '<span class="meta-label">' + t('billing.receipt_period') + '</span><span>' + r.periodStart + ' \u2013 ' + r.periodEnd + '</span>' +
        '<span class="meta-label">' + t('billing.receipt_bill_to') + '</span><span>' + escapeHTML(restaurantName) + '<br>' + escapeHTML(restaurantAddr) + '</span>' +
      '</div>' +
      '<table>' +
        '<tr><th>' + t('billing.receipt_description') + '</th><th>' + t('billing.receipt_amount') + '</th></tr>' +
        '<tr><td>' + t('billing.receipt_platform_fee') + '<div class="item-detail">' + lineDetail + '</div></td><td>CHF ' + r.total.toFixed(2) + '</td></tr>' +
        '<tr class="total-row"><td>' + t('billing.receipt_total') + '</td><td>CHF ' + r.total.toFixed(2) + '</td></tr>' +
      '</table>' +
      '<div class="payment-section">' +
        '<div><span>' + t('billing.receipt_payment') + '</span><span>' + escapeHTML(r.paymentMethod) + '</span></div>' +
        '<div><span>' + t('billing.receipt_status') + '</span><span style="color:#34C759;font-weight:600;">' + t('billing.paid') + '</span></div>' +
      '</div>' +
      '<div class="thank-you">' + t('billing.receipt_thank_you') + '</div>' +
      '<div class="company">BookedEat GmbH \u2022 Z\u00fcrich, Switzerland</div>' +
      '</body></html>';
  }

  function downloadReceipt(r) {
    var html = generateReceiptHTML(r);
    var blob = new Blob([html], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'BookedEat-Receipt-' + r.id + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function initSettings() {
    if (!partner) return;

    $('settings-avatar').innerHTML = avatarHTML(partner.restaurantName, partner.restaurantPhotos);
    $('settings-name').textContent = partner.restaurantName;
    $('settings-address').textContent = partner.restaurantAddress || '';

    try {
      var stats = await apiFetch('/partner/dashboard/stats');
      $('billing-redemptions').textContent = stats.total_redemptions || 0;

      // BookedEat fee
      var beFee = stats.bookedeat_fee || 0;
      $('billing-bookedeat-fee').textContent = 'CHF ' + (typeof beFee === 'number' ? beFee.toFixed(2) : '0.00');

      // Influencer breakdown
      var infBreakdown = stats.influencer_breakdown || [];
      var infTotal = stats.influencer_total || 0;
      if (infBreakdown.length > 0) {
        show($('billing-influencer-section'));
        $('billing-influencer-total').textContent = 'CHF ' + (typeof infTotal === 'number' ? infTotal.toFixed(2) : '0.00');
        var bhtml = '';
        for (var ib = 0; ib < infBreakdown.length; ib++) {
          var inf = infBreakdown[ib];
          bhtml += '<div class="billing-row" style="font-size:13px;padding:2px 0;">' +
            '<span class="billing-label" style="color:rgba(0,0,0,0.5);">@' + escapeHTML(inf.handle) + ' (' + inf.unlocks + ' unlocks)</span>' +
            '<span class="billing-value" style="font-size:13px;">CHF ' + (inf.cost || 0).toFixed(2) + '</span>' +
          '</div>';
        }
        $('billing-influencer-breakdown').innerHTML = bhtml;
      } else {
        hide($('billing-influencer-section'));
      }

      // Total
      var amount = stats.amount_owed || 0;
      $('billing-amount').textContent = 'CHF ' + (typeof amount === 'number' ? amount.toFixed(2) : '0.00');
    } catch (e) { /* ignore */ }

    // Load payment method from backend
    try {
      var pmData = await apiFetch('/partner/payment-method');
      if (pmData.has_payment_method) {
        savedPaymentMethod = { brand: pmData.brand, last4: pmData.last4 };
      }
    } catch (e) { /* ignore */ }

    // Load spending limit & trial status
    try {
      var limitData = await apiFetch('/partner/spending-limit');
      if (limitData.spending_limit != null) {
        $('spending-limit-input').value = limitData.spending_limit;
      }
      $('current-spend-text').textContent = t('billing.current_spend').replace('{0}', (limitData.current_spend || 0).toFixed(2));

      // Trial
      if (limitData.is_trial) {
        show($('trial-banner'));
        hide($('trial-offer'));
        var ends = new Date(limitData.trial_ends_at);
        var daysLeft = Math.ceil((ends - new Date()) / 86400000);
        $('trial-ends-text').textContent = t('billing.trial_days_left').replace('{0}', daysLeft);
      } else if (!limitData.trial_ends_at && !savedPaymentMethod) {
        hide($('trial-banner'));
        show($('trial-offer'));
      } else {
        hide($('trial-banner'));
        hide($('trial-offer'));
      }
    } catch (e) { /* ignore */ }

    // Spending limit save
    $('save-limit-btn').addEventListener('click', async function () {
      var val = $('spending-limit-input').value;
      var limit = val ? parseFloat(val) : null;
      try {
        await apiFetch('/partner/spending-limit', { method: 'PATCH', body: { spending_limit: limit } });
        $('save-limit-btn').textContent = '\u2713';
        setTimeout(function () { $('save-limit-btn').textContent = t('billing.save_limit'); }, 1500);
      } catch (e) { /* ignore */ }
    });

    // Start trial
    $('start-trial-btn').addEventListener('click', async function () {
      try {
        var result = await apiFetch('/partner/start-trial', { method: 'POST' });
        hide($('trial-offer'));
        show($('trial-banner'));
        var ends = new Date(result.trial_ends_at);
        var daysLeft = Math.ceil((ends - new Date()) / 86400000);
        $('trial-ends-text').textContent = t('billing.trial_days_left').replace('{0}', daysLeft);
      } catch (e) {
        alert(e.message || 'Could not start trial.');
      }
    });

    initStripe();
    renderPaymentMethod();
    renderReceipts();
  }

  function setupSettings() {
    // Stripe is initialized lazily in initSettings() on first visit
  }

  function doSignOut() {
    $('dialog-title').textContent = t('dialog.sign_out');
    $('dialog-message').textContent = t('dialog.sign_out_confirm');
    $('dialog-confirm').textContent = t('dialog.sign_out');
    $('dialog-confirm').className = 'dialog-btn dialog-btn-danger';
    $('confirm-dialog').classList.remove('hidden');

    function cleanup() {
      $('confirm-dialog').classList.add('hidden');
      $('dialog-confirm').removeEventListener('click', onConfirm);
      $('dialog-cancel').removeEventListener('click', onCancel);
      $('dialog-confirm').textContent = t('dialog.delete');
    }
    function onConfirm() {
      cleanup();
      clearToken();
      partner = null;
      $('profile-dropdown').classList.add('hidden');
      location.hash = '#login';
    }
    function onCancel() { cleanup(); }

    $('dialog-confirm').addEventListener('click', onConfirm);
    $('dialog-cancel').addEventListener('click', onCancel);
  }

  // ============================================================
  //  VERIFY CODE
  // ============================================================
  function initVerifyCode() {
    $('verify-code-input').value = '';
    $('verify-result').innerHTML = '';
    $('verify-btn').disabled = true;
    $('verify-code-input').focus();
  }

  function setupVerifyCode() {
    var input = $('verify-code-input');
    var btn = $('verify-btn');

    input.addEventListener('input', function () {
      this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      btn.disabled = this.value.length !== 6;
    });

    btn.addEventListener('click', handleVerify);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && this.value.length === 6) handleVerify();
    });
  }

  async function handleVerify() {
    var code = $('verify-code-input').value.trim().toUpperCase();
    if (code.length !== 6) return;

    var btn = $('verify-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    $('verify-result').innerHTML = '';

    try {
      var result = await apiFetch('/partner/verify-code', {
        method: 'POST',
        body: { code: code }
      });

      if (result.success) {
        $('verify-result').innerHTML =
          '<div class="result-card success">' +
            '<div class="result-icon">&#9989;</div>' +
            '<div class="result-title" style="color:var(--green-500);">' + escapeHTML(t('verify.confirmed')) + '</div>' +
            '<div class="result-deal">' + escapeHTML(result.deal_title || 'Deal') + '</div>' +
            (result.discount_label ? '<div class="result-discount">' + escapeHTML(result.discount_label) + '</div>' : '') +
            '<button class="btn-portal-text" id="verify-another" style="margin-top:16px;">' + escapeHTML(t('verify.another')) + '</button>' +
          '</div>';
      } else {
        var error = result.error || 'Unknown error';
        var isExpired = error.toLowerCase().indexOf('expired') > -1;
        var cardClass = isExpired ? 'warning' : 'error';
        var iconChar = isExpired ? '&#9200;' : '&#10060;';
        var titleColor = isExpired ? 'var(--orange-500)' : 'var(--red-500)';

        $('verify-result').innerHTML =
          '<div class="result-card ' + cardClass + '">' +
            '<div class="result-icon">' + iconChar + '</div>' +
            '<div class="result-title" style="color:' + titleColor + ';">' + escapeHTML(t('verify.failed')) + '</div>' +
            '<div class="result-error-text">' + escapeHTML(error) + '</div>' +
            '<button class="btn-portal-text" id="verify-another" style="margin-top:16px;">' + escapeHTML(t('verify.try_again')) + '</button>' +
          '</div>';
      }

      // Bind "Verify Another" / "Try Again"
      var anotherBtn = document.getElementById('verify-another');
      if (anotherBtn) {
        anotherBtn.addEventListener('click', function () {
          initVerifyCode();
        });
      }
    } catch (err) {
      $('verify-result').innerHTML =
        '<div class="result-card error">' +
          '<div class="result-icon">&#10060;</div>' +
          '<div class="result-title" style="color:var(--red-500);">' + escapeHTML(t('verify.failed')) + '</div>' +
          '<div class="result-error-text">' + escapeHTML(err.message || t('verify.failed')) + '</div>' +
          '<button class="btn-portal-text" id="verify-another" style="margin-top:16px;">' + escapeHTML(t('verify.try_again')) + '</button>' +
        '</div>';
      var anotherBtn2 = document.getElementById('verify-another');
      if (anotherBtn2) anotherBtn2.addEventListener('click', function () { initVerifyCode(); });
    } finally {
      btn.disabled = false;
      btn.textContent = t('verify.button');
    }
  }

  // ============================================================
  //  INIT
  // ============================================================
  function setupNav() {
    // Profile dropdown toggle
    $('profile-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      $('lang-switcher-dropdown').classList.add('hidden');
      var dd = $('profile-dropdown');
      dd.classList.toggle('hidden');
    });

    // Language switcher
    $('lang-switcher-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      $('profile-dropdown').classList.add('hidden');
      $('lang-switcher-dropdown').classList.toggle('hidden');
    });

    var langOpts = document.querySelectorAll('.lang-option');
    for (var i = 0; i < langOpts.length; i++) {
      langOpts[i].addEventListener('click', function () {
        setLang(this.getAttribute('data-lang'));
        $('lang-switcher-dropdown').classList.add('hidden');
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
      var dd = $('profile-dropdown');
      if (!dd.classList.contains('hidden') && !e.target.closest('.portal-nav-right')) {
        dd.classList.add('hidden');
      }
      var ld = $('lang-switcher-dropdown');
      if (!ld.classList.contains('hidden') && !e.target.closest('.lang-switcher-wrap')) {
        ld.classList.add('hidden');
      }
    });

    // Sign out from dropdown
    $('dropdown-sign-out').addEventListener('click', function () {
      $('profile-dropdown').classList.add('hidden');
      doSignOut();
    });

    // Init language switcher state
    $('lang-switcher-label').textContent = currentLang.toUpperCase();
    var opts = document.querySelectorAll('.lang-option');
    for (var j = 0; j < opts.length; j++) {
      opts[j].classList.toggle('active', opts[j].getAttribute('data-lang') === currentLang);
    }
  }

  function updateNavProfile() {
    if (!partner) return;
    var name = partner.restaurantName || 'Restaurant';
    var initial = name.charAt(0).toUpperCase();
    var photos = partner.restaurantPhotos;

    if (photos && photos.length > 0) {
      $('nav-avatar').innerHTML = '<img src="' + photos[0] + '" alt="">';
    } else {
      $('nav-avatar').textContent = initial;
    }
    $('dropdown-name').textContent = name;
    $('dropdown-email').textContent = partner.restaurantAddress || '';
  }

  // ============================================================
  //  NEWS POSTS
  // ============================================================
  var POST_TYPES = [
    { value: 'update', label: 'post_form.type_update', icon: '📝' },
    { value: 'event', label: 'post_form.type_event', icon: '🎉' },
    { value: 'menu', label: 'post_form.type_menu', icon: '🍽️' },
    { value: 'announcement', label: 'post_form.type_announcement', icon: '📢' },
    { value: 'promotion', label: 'post_form.type_promotion', icon: '🏷️' }
  ];
  var selectedPostType = 'update';

  function setupPostsPage() {
    var addBtn = $('posts-add-btn');
    if (addBtn) addBtn.addEventListener('click', function () { location.hash = '#post-form'; });
    var createFirst = $('posts-create-first');
    if (createFirst) createFirst.addEventListener('click', function () { location.hash = '#post-form'; });
  }

  async function initPosts() {
    show($('posts-loading'));
    hide($('posts-list'));
    hide($('posts-empty'));
    try {
      var results = await Promise.all([
        apiFetch('/partner/posts'),
        apiFetch('/partner/deals')
      ]);
      posts = results[0];
      deals = results[1];
    } catch (e) {
      console.error('[BookedEat] Failed to load posts:', e);
      posts = [];
    }
    hide($('posts-loading'));
    renderPosts();
  }

  function renderPosts() {
    if (posts.length === 0) {
      hide($('posts-list'));
      show($('posts-empty'));
      return;
    }
    hide($('posts-empty'));
    show($('posts-list'));

    var html = '';
    for (var i = 0; i < posts.length; i++) {
      var p = posts[i];
      var typeObj = POST_TYPES.find(function (pt) { return pt.value === p.post_type; }) || POST_TYPES[0];
      var dateStr = new Date(p.created_at).toLocaleDateString();
      var statusBadge = p.published
        ? '<span class="deal-badge">' + t('posts.published') + '</span>'
        : '<span class="deal-badge insider">' + t('posts.draft') + '</span>';
      // Show attached deal name
      var dealBadge = '';
      if (p.deal_id) {
        var attachedDeal = deals.find(function (d) { return d.id === p.deal_id; });
        dealBadge = '<span class="deal-badge" style="background:rgba(255,59,48,0.1);color:#FF3B30;">🏷️ ' +
          (attachedDeal ? escapeHTML(attachedDeal.title) : 'Deal attached') + '</span>';
      }
      var imagePreview = '';
      if (p.image_urls && p.image_urls.length > 0) {
        imagePreview = '<div class="post-card-image"><img src="' + escapeHTML(p.image_urls[0]) + '" alt=""></div>';
      }

      html += '<div class="deal-card" data-post-id="' + p.id + '">' +
        '<div class="deal-card-top">' +
          '<div class="deal-badges">' + statusBadge + '<span class="deal-badge">' + typeObj.icon + ' ' + t(typeObj.label) + '</span>' + dealBadge + '</div>' +
          '<label class="deal-toggle">' +
            '<input type="checkbox"' + (p.published ? ' checked' : '') + ' data-post-toggle-id="' + p.id + '">' +
            '<span class="deal-toggle-slider"></span>' +
          '</label>' +
        '</div>' +
        imagePreview +
        '<div class="deal-card-body" data-post-edit-id="' + p.id + '" style="cursor:pointer;">' +
          '<div class="deal-card-title">' + escapeHTML(p.title) + '</div>' +
          '<div class="deal-card-validity">' + escapeHTML(p.body ? p.body.substring(0, 100) + (p.body.length > 100 ? '...' : '') : '') + '</div>' +
          '<div class="deal-card-redemptions">' + dateStr + '</div>' +
        '</div>' +
        '<div class="deal-card-actions">' +
          '<button class="btn-icon" data-post-edit-id="' + p.id + '" title="Edit">&#9998;</button>' +
          '<button class="btn-icon danger" data-post-delete-id="' + p.id + '" title="Delete">&#128465;</button>' +
        '</div>' +
      '</div>';
    }
    $('posts-list').innerHTML = html;

    // Bind toggle
    var toggles = $('posts-list').querySelectorAll('[data-post-toggle-id]');
    for (var ti = 0; ti < toggles.length; ti++) {
      toggles[ti].addEventListener('change', function () {
        var id = this.getAttribute('data-post-toggle-id');
        apiFetch('/partner/posts/' + id + '/toggle', { method: 'PATCH' }).then(function () { initPosts(); });
      });
    }
    // Bind edit
    var edits = $('posts-list').querySelectorAll('[data-post-edit-id]');
    for (var e = 0; e < edits.length; e++) {
      edits[e].addEventListener('click', function () { location.hash = '#post-form/' + this.getAttribute('data-post-edit-id'); });
    }
    // Bind delete
    var deletes = $('posts-list').querySelectorAll('[data-post-delete-id]');
    for (var d = 0; d < deletes.length; d++) {
      deletes[d].addEventListener('click', function (ev) {
        ev.stopPropagation();
        handlePostDelete(this.getAttribute('data-post-delete-id'));
      });
    }
  }

  function handlePostDelete(id) {
    var post = posts.find(function (p) { return p.id === id; });
    if (!post) return;
    $('dialog-title').textContent = t('posts.delete_title');
    $('dialog-message').textContent = t('posts.delete_message').replace('{0}', post.title);
    $('confirm-dialog').classList.remove('hidden');

    var confirmBtn = $('dialog-confirm');
    var cancelBtn = $('dialog-cancel');
    function cleanup() {
      $('confirm-dialog').classList.add('hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
    }
    async function onConfirm() {
      cleanup();
      try { await apiFetch('/partner/posts/' + id, { method: 'DELETE' }); } catch (e) { /* ignore */ }
      initPosts();
    }
    function onCancel() { cleanup(); }
    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
  }

  // ── Post Form ──

  function updatePostTypePills() {
    var container = $('post-type-pills');
    if (!container) return;
    var html = '';
    for (var i = 0; i < POST_TYPES.length; i++) {
      var pt = POST_TYPES[i];
      var active = pt.value === selectedPostType ? ' active' : '';
      html += '<button type="button" class="type-pill' + active + '" data-post-type="' + pt.value + '">' +
        pt.icon + ' ' + t(pt.label) + '</button>';
    }
    container.innerHTML = html;
    var pills = container.querySelectorAll('[data-post-type]');
    for (var j = 0; j < pills.length; j++) {
      pills[j].addEventListener('click', function () {
        selectedPostType = this.getAttribute('data-post-type');
        updatePostTypePills();
      });
    }
  }

  async function initPostForm(postId) {
    editingPostId = postId || null;
    postImageKeys = [];
    postImagePreviews = [];
    selectedPostType = 'update';

    var titleEl = $('post-form-title');
    var submitEl = $('post-submit-btn');

    // Load deals for the deal selector
    try {
      var partnerDeals = await apiFetch('/partner/deals');
      var select = $('post-deal-select');
      select.innerHTML = '<option value="">' + t('post_form.no_deal') + '</option>';
      for (var i = 0; i < partnerDeals.length; i++) {
        var d = partnerDeals[i];
        if (d.is_active) {
          select.innerHTML += '<option value="' + d.id + '">' + escapeHTML(d.title) + '</option>';
        }
      }
    } catch (e) { /* ignore */ }

    if (editingPostId) {
      titleEl.textContent = t('post_form.edit');
      submitEl.querySelector('span').textContent = t('post_form.save');
      // Load existing post
      var existingPost = posts.find(function (p) { return p.id === editingPostId; });
      if (existingPost) {
        $('post-title').value = existingPost.title;
        $('post-body').value = existingPost.body || '';
        selectedPostType = existingPost.post_type || 'update';
        $('post-deal-select').value = existingPost.deal_id || '';
        $('post-event-date').value = existingPost.event_date ? existingPost.event_date.substring(0, 10) : '';
        $('post-published').checked = existingPost.published;
        postImageKeys = existingPost.image_urls || [];
        postImagePreviews = existingPost.image_urls || []; // already signed URLs from API
        renderPostImagePreviews();
      }
    } else {
      titleEl.textContent = t('post_form.create');
      submitEl.querySelector('span').textContent = t('post_form.create');
      $('post-title').value = '';
      $('post-body').value = '';
      $('post-deal-select').value = '';
      $('post-event-date').value = '';
      $('post-published').checked = true;
      renderPostImagePreviews();
    }
    updatePostTypePills();
  }

  function renderPostImagePreviews() {
    var container = $('post-image-previews');
    if (!container) return;
    if (postImageKeys.length === 0) {
      container.innerHTML = '';
      return;
    }
    var html = '';
    for (var i = 0; i < postImageKeys.length; i++) {
      var url = postImagePreviews[i] || postImageKeys[i];
      html += '<div class="post-image-thumb">' +
        '<img src="' + escapeHTML(url) + '" alt="">' +
        '<button type="button" class="post-image-remove" data-img-idx="' + i + '">&times;</button>' +
      '</div>';
    }
    container.innerHTML = html;
    var removes = container.querySelectorAll('[data-img-idx]');
    for (var j = 0; j < removes.length; j++) {
      removes[j].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-img-idx'));
        postImageKeys.splice(idx, 1);
        postImagePreviews.splice(idx, 1);
        renderPostImagePreviews();
      });
    }
  }

  async function uploadPostImages(files) {
    if (!files || files.length === 0) return;
    var uploadLabel = $('post-upload-label');
    var origText = uploadLabel.textContent;
    uploadLabel.textContent = t('post_form.uploading');

    try {
      var presignData = await apiFetch('/images/presign', {
        method: 'POST',
        body: { count: files.length, prefix: 'post' }
      });
      for (var i = 0; i < presignData.length; i++) {
        await fetch(presignData[i].uploadUrl, {
          method: 'PUT',
          body: files[i],
          headers: { 'Content-Type': 'image/jpeg' }
        });
        postImageKeys.push(presignData[i].key);
        postImagePreviews.push(URL.createObjectURL(files[i]));
      }
      renderPostImagePreviews();
    } catch (e) {
      console.error('[BookedEat] Image upload failed:', e);
    }
    uploadLabel.textContent = origText;
  }

  function setupPostForm() {
    var backBtn = $('post-form-back-btn');
    if (backBtn) backBtn.addEventListener('click', function () { location.hash = '#posts'; });

    var imageInput = $('post-image-input');
    if (imageInput) {
      imageInput.addEventListener('change', function () {
        uploadPostImages(this.files);
        this.value = '';
      });
    }

    var form = $('post-form');
    if (form) {
      form.addEventListener('submit', async function (ev) {
        ev.preventDefault();
        var title = $('post-title').value.trim();
        if (!title) { $('post-title').focus(); return; }

        var submitBtn = $('post-submit-btn');
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = editingPostId ? t('post_form.saving') : t('post_form.creating');

        var body = {
          title: title,
          body: $('post-body').value.trim(),
          post_type: selectedPostType,
          image_urls: postImageKeys,
          deal_id: $('post-deal-select').value || null,
          event_date: $('post-event-date').value || null,
          published: $('post-published').checked
        };

        try {
          if (editingPostId) {
            await apiFetch('/partner/posts/' + editingPostId, { method: 'PATCH', body: body });
          } else {
            await apiFetch('/partner/posts', { method: 'POST', body: body });
          }
          location.hash = '#posts';
        } catch (e) {
          console.error('[BookedEat] Post save failed:', e);
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = editingPostId ? t('post_form.save') : t('post_form.create');
        }
      });
    }
  }

  function init() {
    setupNav();
    setupLogin();
    setupDealsPage();
    setupDealForm();
    setupPostsPage();
    setupPostForm();
    setupSettings();
    setupRestaurantSettings();
    setupVerifyCode();
    setupOpeningHours();

    // Initialize type pills and day toggles in DOM
    updateTypePills();
    updateDayToggles();
    updatePostTypePills();

    // Apply translations
    translatePage();

    // Check session
    checkSession();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
