// === WhatsApp : numéro et messages prédéfinis ===
export const WA_NUMBER = "237675807166"; // +237 675 80 71 66

export const WA_MESSAGES = {
  reserve:
    "Bonjour Saveur Yaoundé 👋\nJe souhaite réserver une table.\n\n📅 Date : \n🕒 Heure : \n👥 Nombre de personnes : \n\nMerci de me confirmer la disponibilité.",
  call: "Bonjour Saveur Yaoundé 👋\nJ'aimerais échanger avec vous (informations, événement, groupe). Pouvez-vous me répondre ici ou m'appeler ? Merci !",
  order: (dish) =>
    `Bonjour Saveur Yaoundé 👋\nJe souhaite commander : ${dish}.\n\n📍 Adresse de livraison : \nMerci de me confirmer le prix total et le délai.`,
};

export const waUrl = (text) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
