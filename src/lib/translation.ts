/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TargetLanguage = 'en' | 'tl' | 'bis';

export const INGREDIENT_TRANSLATIONS: Record<string, Record<TargetLanguage, string>> = {
  'NFA Rice': {
    en: 'NFA Rice (Energy-giving grain)',
    tl: 'Bigas o Lugaw (Nagbibigay ng sapat na lakas para maglaro)',
    bis: 'Bugas o Lugaw (Nagahatag og kusog aron makadula sa tibuok adlaw)'
  },
  'Canned Sardines (Tomato Sauce)': {
    en: 'Canned Sardines (Protein for muscles & iron)',
    tl: 'Sardinas sa Kamatis (Sardinas para lumaki ang kalamnan at sumigla ang dugo)',
    bis: 'Sardinas sa Kamatis (Sardinas para mokusog ang unod ug lagsik ang dugo)'
  },
  'Fresh Chicken Egg': {
    en: 'Fresh Chicken Egg (Protein for rapid growth and repair)',
    tl: 'Sariwang Itlog ng Manok (Pampalaki ng buto, dumi, at kalamnan)',
    bis: 'Lab-as nga Itlog sa Manok (Pampalig-on ug pampadali og dako)'
  },
  'Malunggay Leaves (Moringa)': {
    en: 'Malunggay Leaves (Powerhouse vegetable for blood & calcium)',
    tl: 'Mga Dahon ng Malunggay (Sariwang pampasigla ng dugo mula sa bakuran)',
    bis: 'Dahon sa Kamunggay (Presko nga makapahimsog sa dugo gikan sa tugkaran)'
  },
  'Squash (Kalabasa)': {
    en: 'Squash / Kalabasa (Vitamin A for bright eyes & smooth skin)',
    tl: 'Kalabasa (Para sa malinaw na mata at iwas-sakit sa baga)',
    bis: 'Kalabasa (Para sa hayag nga panan-aw ug proteksyon batok sa ubo)'
  },
  'Kamote (Sweet Potato)': {
    en: 'Kamote / Sweet Potato (Tasty energy to help child play and gain weight)',
    tl: 'Kamote (Masarap at pampabigat ng timbang ng inyong bunso)',
    bis: 'Kamote (Lamiang pagkaon pampatambok ug pampakusog sa lawas)'
  },
  'Moringa Leaves (Malunggay)': {
    en: 'Malunggay Leaves (Powerhouse vegetable for blood & calcium)',
    tl: 'Dahon ng Malunggay (Pampasigla ng dugo at utak)',
    bis: 'Dahon sa Kamunggay (Pampakusog sa dugo ug bukog)'
  },
  'Sweet Potato (Kamote)': {
    en: 'Kamote / Sweet Potato (Tasty energy to help child play and gain weight)',
    tl: 'Kamote (Pampalusog at pampabigat ng timbang para maging malusog)',
    bis: 'Kamote (Lamiang pagkaon pampasaka sa timbang)'
  }
};

export const UI_LABELS: Record<string, Record<TargetLanguage, string>> = {
  viewModeLabel: {
    en: "Choose Handout Style:",
    tl: "Uri ng Gabay:",
    bis: "Estilo sa Giya:"
  },
  langLabel: {
    en: "Nanay's Language:",
    tl: "Wika para kay Nanay:",
    bis: "Pinulongan sa Inahan:"
  },
  professionalView: {
    en: "📊 Scholar / Health Worker View",
    tl: "📊 Pang-BNS (Professional View)",
    bis: "📊 Pang-Nutrition Scholar (View)"
  },
  maternalHandout: {
    en: "💝 Nanay's Friendly Handout",
    tl: "💝 Gabay para kay Nanay (Handout)",
    bis: "💝 Giya para kay Nanay (Handout)"
  },
  ingredientsTitle: {
    en: "Ingredients Needed",
    tl: "Mga Kakailanganing Sangkap",
    bis: "Mga Kakailanganong Sagol"
  },
  instructionsTitle: {
    en: "Step-by-Step Cooking Guide",
    tl: "Madaling Gabay sa Pagluluto",
    bis: "Paagi sa Pagluto para kay Nanay"
  },
  checklistTitle: {
    en: "Nanay's Checklist for Feeding Success",
    tl: "Checklist ni Nanay para sa Malusog na Anak",
    bis: "Tseklist sa Inahan para sa Himsog nga Anak"
  },
  whyGoodTitle: {
    en: "How this makes your child strong and energetic",
    tl: "Paano ito makakatulong sa inyong anak:",
    bis: "Unsaon ni pagtabang sa imong anak:"
  },
  motherTip1: {
    en: "Wash hands with clean soap and water before cooking or feeding your child.",
    tl: "Hugasan nang mabuti ang mga kamay gamit ang sabon at malinis na tubig bago magluto o magsubo sa bata.",
    bis: "Manghugas og maayo sa kamot gamit ang sabon ug limpyo nga tubig sa dili pa magluto o magpakaon sa bata."
  },
  motherTip2: {
    en: "Ensure you use boiled, safe drinking water for your child's soup or drinking cup.",
    tl: "Gumamit lamang ng pinakuluang malinis na tubig para sa sabaw at inumin ng inyong anak.",
    bis: "Siguroha nga gipabukalan ug limpyo nga tubig ang gamiton para sa sabaw ug ilimnon sa bata."
  },
  motherTip3: {
    en: "Feed small, baby-sized bites and talk with your child lovingly during meals.",
    tl: "Isubo ang katamtamang liit o durog na pagkain at kausapin si baby nang may pagmamahal habang kumakain.",
    bis: "Ipapakaon sa ginagmay nga dako o dugmok nga mga sugba ug storyahi si baby og maluluy-on samtang nagkaon."
  },
  encouragingClosing: {
    en: "💝 Message of Love from your Barangay Health Center:\n\"Nanay, you are not alone in this journey of raising a healthy, happy child! Every spoonful of this healthy meal gives your child energy to play, grow, and learn. Together with your Barangay Health Center, we are supporting you every step of the way! Kaya natin ito!\"",
    tl: "💝 Mensahe ng Pagmamahal mula sa inyong Barangay Health Center:\n\"Nanay, hindi po kayo nag-iisa sa pagpapalaki ng isang malusog at masayang anak! Bawat subo ng masustansyang pagkain na ito ay nagbibigay kay baby ng lakas para maglaro, lumaki, at tumalino. Kasama ang inyong Barangay Health Center, naka-suporta po kami sa inyo palagi. Kaya natin ito!\"",
    bis: "💝 Mensahe sa Gugma gikan sa imong Barangay Health Center:\n\"Nanay, wala ka nag-inusara niining panaw sa pagpadako og himsog ug malipayon nga anak! Matag sugo niining masustansyang pagkaon nagahatag og kusog sa bata aron makandula, modako, ug makakat-on. Kauban sa imong Barangay Health Center, andam mi mosuporta kanimo kanunay. Kaya nato ni Nanay!\""
  },
  stretchingTitle: {
    en: "Smart Ways to Partition Rations Safely",
    tl: "Paraan para Pagkasyahin at Paabutin ang Pagkain Buong Araw",
    bis: "Mga Paagi sa Pagpakaigo sa Pagkaon sa Tibuok Adlaw"
  },
  prepStrategyLabel: {
    en: "A. How to Divide Your Ingredients across the Day",
    tl: "A. Gabay sa Paghahati para sa Almusal, Tanghalian, at Hapunan",
    bis: "A. Giya sa Pagbahin alang sa Pamahaw, Paniudto, ug Panihapon"
  },
  brothAdditionLabel: {
    en: "B. Satiety and Adding Safe Warm Broth (Sabaw)",
    tl: "B. Pagpapasabaw nang Ligtas upang Mabusog si Baby",
    bis: "B. Masustansyang Sabaw para Mabusog ug Mainitan si Baby"
  },
  nutritionalFocusLabel: {
    en: "C. Directing the Wealth of Nutrition to Your Recovering Child",
    tl: "C. Pag-focus sa Pinaka-Sustansya para sa Batang Palalakasin",
    bis: "C. Paghatag sa Pinaka-Sustansya diritso sa Anak nga Ginapalig-on"
  },
  waterCaution: {
    en: "Always boil drinking water. Clean surroundings make a healthy child.",
    tl: "Pakuluan palagi ang tubig-inumin. Ang malinis na paligid ay nagdudulot ng malusog na sanggol.",
    bis: "Kanunay ipabukal ang tubig nga imnon. Ang limpyo nga palibot nagahatag og himsog nga bata."
  },
  hygieneSectionTitle: {
    en: "🏡 Local Food Safety & Rural Hygiene Guide",
    tl: "🏡 Gabay sa Kaligtasan ng Pagkain at Kalinisan sa Probinsya",
    bis: "🏡 Giya sa Kaluwasan sa Pagkaon ug Kalimpyo sa Probinsya"
  },
  hygieneTip1Title: {
    en: "1. DIY Running Water for Handwashing",
    tl: "1. DIY Running Water para sa Paghuhugas",
    bis: "1. DIY Naga-agas nga Tubig para sa Paghugas"
  },
  hygieneTip1Desc: {
    en: "Wash hands with clean soap and flowing water for 20 seconds before cooking or feeding. If there is no tap/gripo, use a clean dipper (tabo) and have another family member pour water over your hands, rather than dipping hands directly into a standing bowl or bucket (palanggana), which spreads germs.",
    tl: "Hugasan ang kamay gamit ang sabon at umaagos na tubig sa loob ng 20 segundo bago magluto o magsubo. Kung walang gripo, gumamit ng malinis na tabo at magpatulong sa kasama sa bahay na ibuhos ito sa iyong kamay. IWASAN ang paglubog ng kamay sa palanggana dahil mabilis nitong ikinakalat ang dumi at mikrobyo.",
    bis: "Hugasi ang mga kamot gamit ang sabon ug naga-agas nga tubig sulod sa 20 segundos sa dili pa magluto o magpakaon sa bata. Kung walay gripo, mogamit og limpyo nga tabo ug pabasbasa ang tubig sa kamot kauban ang laing tawo. LIKAYAN ang pagtuslob sa kamot diritso sa planggana kay dali ra kaayo makakatag og kagaw."
  },
  hygieneTip2Title: {
    en: "2. Safe Water Storage & Scooping",
    tl: "2. Ligtas na Lalagyan at Pagsalok ng Tubig",
    bis: "2. Luwas nga Sudlanan ug Pagsalok sa Tubig"
  },
  hygieneTip2Desc: {
    en: "Keep drinking water containers tightly sealed and elevated off the floor to prevent floor dust, chickens, or house pests from contaminating the vessel. Always use a dedicated clean cup with a long handle to scoop drinking water, or use container jugs equipped with a functional tap/gripo.",
    tl: "Panatilihing laging sarado ang takip ng inuming tubig at HUWAG itong itatabi sa sahig upang hindi dapuan ng alikabok, manok, o peste. Gumamit lamang ng malinis at may mahabang hawakan na sandok o baso sa pagsalok ng tubig, o gumamit ng container na may sariling gripo.",
    bis: "Kanunay tabunan og hugot ang sudlanan sa tubig-imnon ug I-ISA kini gikan sa salog aron dili maabot sa abog, mga manok, o laing peste. Mogamit og baso nga limpyo ug dunay taas nga kuptanan sa pagsalok, o mas maayo kadtong decanter/container nga naay kaugalingong gripo."
  },
  hygieneTip3Title: {
    en: "3. Clean Yard Ingredient Washing & Pest Control",
    tl: "3. Paglilinis ng Sangkap at Pagkalinga sa Pagkain",
    bis: "3. Paghugas sa Sagol ug Pagpanalipod sa Pagkaon"
  },
  hygieneTip3Desc: {
    en: "Wash backyard veggies and leafy malunggay under clean, flowing water to detach micro-soil and bacteria. Always cover prepared plates or cooking pots using a traditional clean food cover (tudong) or fly-proof mesh to prevent houseflies and yard animals from spoiling the child's meal.",
    tl: "Hugasan ang mga gulay at dahon ng malunggay mula sa bakuran sa ilalim ng umaagos na tubig bago pitasin o hiwain. Takpan palagi ang nilutong pagkain gamit ang malinis na tudong (food cover) o kulambo ng pagkain upang hindi madapuan ng langaw, langgam, o dumi ng hayop.",
    bis: "Hugasi pag-ayo ang mga utanon ug dahon sa kamunggay gikan sa tugkaran sa naga-agas nga tubig sa dili pa putlon. Kanunayng tabunan ang giluto nga pagkaon gamit ang limpyo nga tudong (food cover) o kulambo sa pagkaon aron dili madapuan sa langaw, hulmigas, o hugaw."
  },
  seenByBNS: {
    en: "✓ Seen by BNS",
    tl: "✓ Natingnan ng BNS",
    bis: "✓ Nabisitahan ug Nakita sa BNS"
  },
  seenByBNSDesc: {
    en: "Please checklist and report back to your local Barangay Nutrition Scholar to secure family rewards/care updates!",
    tl: "Mangyaring lagyan ng tsek at iulat sa inyong Barangay Nutrition Scholar upang masubaybayan ang kalusugan ng bata!",
    bis: "Palihug og tsek ug i-report sa inyong Barangay Nutrition Scholar aron ma-update ang kalusugan sa bata!"
  }
};

const CLINICAL_REPLACEMENTS: Array<{ regex: RegExp; replacements: Record<TargetLanguage, string> }> = [
  {
    regex: /caloric density|calorie-dense|energy-dense/gi,
    replacements: {
      en: "energy to play, run, and grow big",
      tl: "lakas at sigla para makapaglaro at lumaki nang malusog",
      bis: "kusog ug kabaskog aron makadula ug modako og maayo"
    }
  },
  {
    regex: /essential amino acids|amino acids|essential lipid/gi,
    replacements: {
      en: "body-building strength to make muscles grow",
      tl: "pampatibay ng katawan at kalamnan ng inyong maliit na anak",
      bis: "makapabaskog sa kaunuran ug kalawasan sa bata"
    }
  },
  {
    regex: /hemoglobin synthesis|iron deficiency|correcting iron deficiency|anemia/gi,
    replacements: {
      en: "building healthy red blood to fight tiredness",
      tl: "pampasigla ng kaniyang dugo laban sa labis na pagkapagod o panghihina",
      bis: "makapahimsog sa kaniyang dugo aron dili maluya"
    }
  },
  {
    regex: /mucosal immunity|immune system|immunity cells/gi,
    replacements: {
      en: "protection to help fight off coughs, colds, and fever",
      tl: "panlaban sa mga sakit gaya ng ubo, sipon, at lagnat",
      bis: "panalipod batok sa ubo, sipon, ug hilanat"
    }
  },
  {
    regex: /rapid weight recovery|weight-gain assistance/gi,
    replacements: {
      en: "helping your sweet child gain a healthy weight quickly",
      tl: "pagtulong sa inyong anak na mabilis na ubusin at bumigat ang kaniyang timbang",
      bis: "pagtabang sa imong anak nga mapaspasan ang pag-saka sa timbang ug motambok"
    }
  },
  {
    regex: /digestible carbohydrate base|digestible/gi,
    replacements: {
      en: "easy to swallow and very friendly on your child's tummy",
      tl: "napakadaling lunukin at napakagaan sa sensitibong tiyan ni baby",
      bis: "sayon kaayong tunlon ug gaan kaayo sa gamayng tiyan sa bata"
    }
  },
  {
    regex: /recovering from illness|frail child|underweight recoveries/gi,
    replacements: {
      en: "getting healthy, active, and playful again",
      tl: "muling sumigla at maging masigla sa paglalaro araw-araw",
      bis: "paspas nga maulian ug malipayong makadula pag-usab"
    }
  },
  {
    regex: /nutrient-dense/gi,
    replacements: {
      en: "packed with loving vitamins and healthy fats",
      tl: "siksik sa bitamina at sustansya na kailangan ng inyong sanggol",
      bis: "puno sa bitamina ug tambok nga himsog para sa bata"
    }
  },
  {
    regex: /micro-portions/gi,
    replacements: {
      en: "small, manageable, easy-to-snack sizes",
      tl: "maliit at madaling ubusin na subo",
      bis: "ginagmay nga pakaon nga dali ra mahurot"
    }
  },
  {
    regex: /caloric gap|energy gap/gi,
    replacements: {
      en: "lack of energy in the afternoon",
      tl: "kulang sa lakas kapag hapon",
      bis: "kakulang sa kusog sa bata"
    }
  },
  {
    regex: /fat-soluble vitamins/gi,
    replacements: {
      en: "natural nutrients that look after your child's skin and stamina",
      tl: "likas na sustansya para sa magandang balat at lakas",
      bis: "sustansya para sa nindot nga panit ug lawas sa anak"
    }
  }
];

const SIMPLE_SENTENCE_TRANSLATIONS: Record<string, Record<TargetLanguage, string>> = {
  // Option 1 translations
  "Boil 1/2 cup of NFA rice in 3 cups of water with a small pinch of salt, stirring continuously to create a soft porridge (lugaw).": {
    en: "Boil 1/2 cup of rice in 3 cups of clean water with a tiny pinch of salt. Stir nicely to turn it into a soft, smooth lugaw.",
    tl: "Pakuluan ang kalahating tasa ng bigas sa tatlong tasa ng malinis na tubig na may kaunting-kaunting asin. Haluin nang dahan-dahan para maging malambot na lugaw.",
    bis: "Lutoa o pakulu-i ang katunga sa tasa nga bugas sa tulo ka tasa nga limpyo nga tubig ug butngi og gamayng asin. Sigeha og ukab aron mahimong humok nga lugaw."
  },
  "Mash the kalabasa and mix it into the boiling rice to give the porridge a nutritious yellow hue and soft consistency.": {
    en: "Mash the sweet squash nicely and stir it into the hot porridge. This makes the lugaw friendly, colorful, and highly healthy.",
    tl: "Durugin o lamasin ang kalabasa at ihalo ito sa kumukulong lugaw upang ito ay maging kulay-dilaw, magandang tingnan at masustansya para kay baby.",
    bis: "Dukduka o piga-a ang kalabasa ug isagol kini sa nagbukal nga lugaw aron mahimo kining yellow o dalag nga puno sa sustansya ug humok kaonon."
  },
  "Whisk in a fresh egg directly into the porridge during the final 3 minutes of cooking to cook the proteins smoothly.": {
    en: "Stir in a fresh egg directly into the cooking lugaw in the last 3 minutes so it blends in and boosts your child's body power.",
    tl: "Ihalo o ibati ang sariwang itlog diritso sa lugaw sa huling tatlong minuto ng pagluluto para masarap at masustansya ang bawat subo.",
    bis: "I-batch o batila ang presko nga itlog ug isagol diritso sa lugaw sa katapusang tulo ka minuto sa pagluto aron masustansya ug lami ang bawat hungit."
  },
  "Serve warm. Easy to digest for toddlers.": {
    en: "Serve this warm. It is very soft and easy on your toddler's small stomach.",
    tl: "Ipainom o ipakain habang maligamgam. Napakadaling kainin at dighayin ng inyong maliit na anak.",
    bis: "Ipapakaon samtang init-init pa. Sayon kaayong tunlon ug hilison sa gamayng tiyan sa bata."
  },
  "Slice the sweet potato (kamote) into thin spears and lightly pan-fry in a small amount of cooking oil until soft.": {
    en: "Cut the sweet kamote into thin sticks and fry carefully in just a drop of cooking oil until soft and sweet.",
    tl: "Hiwain ang kamote nang manipis at dahan-dahang lutuin sa kaunting-kaunting mantika o pakuluan sa maliit na kawali hanggang lumambot.",
    bis: "Hiwa-a ang kamote sa ginagmay nga porma ug iprito sa gamay kaayong mantika hangtod nga nindot ug lumoy."
  },
  "Beat the egg in a small cup with a pinch of salt and stir in fresh malunggay leaves.": {
    en: "Whip the fresh egg in a cup with a tiny pinch of salt, then stir in the clean malunggay leaves.",
    tl: "Ibati ang itlog sa baso na may kaunting asin, at ihalo ang sariwa at hugas na dahon ng malunggay.",
    bis: "Batila ang itlog sa gamay nga baso nga adunay gamayng asin ug isagol ang presko nga hinlo nga dahon sa kamunggay."
  },
  "Pour the egg mix into the pan, cooking until set to make a soft herb omelet.": {
    en: "Pour the egg and malunggay in the pot/pan and cook slowly until it forms a soft, tasty egg omelet.",
    tl: "Ibuhos ang hinalong itlog sa kawali o kaldero, lutuin nang marahan hanggang sa maging malambot na torta na paborito ni baby.",
    bis: "I-yabo ang batil nga itlog sa kalaha o kaldero, ug lutoa hangtod mahimong nindot ug humok nga torta alang sa bata."
  },
  "Serve the sweet and savory combination together for convenient finger-feeding.": {
    en: "Serve the sweet kamote together with the soft egg. This is perfect to cut into small bites for easy self-feeding.",
    tl: "Ihain ang matamis na kamote kasama ang masarap na tortang malunggay. Madali po itong hawakan at isubo ng bata nang ligtas.",
    bis: 'I-dalit ang kamote ug ang torta dungan aron sayon kuptan ug kaonon sa bata gamit ang iyang kamot.'
  },
  "Throw in the fresh malunggay leaves, add a pinch of salt to taste, and simmer for 1 final minute before serving warm.": {
    en: "Toss in the clean malunggay leaves, add a tiny pinch of salt to make it tasty, and cook for just one more minute before serving warm.",
    tl: "Ihalo ang sariwang dahon ng malunggay, lagyan ng kaunting asin para magkalasa, at pakuluan ng huling isang minuto bago ihain habang maligamgam.",
    bis: "Isagol ang presko nga dahon sa kamunggay, butngi og gamayng asin para lami, ug pakulu-i og usa ka minuto sa dili pa i-dalit."
  },
  "Boil and stir the egg mix directly into the water pool to set into a soft, digestible egg drop": {
    en: "Stir the beat egg directly into the boiling water helper. This turns into soft, easily-digestible egg ribbons for baby.",
    tl: "Ibati ang itlog sa kumukulong sabaw at haluin para maging napakalambot na egg-drop sabaw na swak sa tiyan.",
    bis: "I-sagol ang batil nga itlog diritso sa nagbukal nga sabaw aron mahimo kining humok nga 'egg-drop' sabaw nga masustansya."
  }
};

/**
 * Strips clinical terminology and translates/rephrases dynamically based on selected language
 */
export function simplifyAndTranslateText(text: string, lang: TargetLanguage): string {
  if (!text) return "";

  let resultString = text;

  // Let's check for specific overall translation mappings first
  for (const [englishSent, langTranslations] of Object.entries(SIMPLE_SENTENCE_TRANSLATIONS)) {
    if (resultString.includes(englishSent)) {
      resultString = resultString.replace(englishSent, langTranslations[lang]);
    }
  }

  // Apply clinical regex replacements
  CLINICAL_REPLACEMENTS.forEach(repl => {
    resultString = resultString.replace(repl.regex, repl.replacements[lang]);
  });

  // Simple fallbacks if Tagalog/Bisaya requested but text remains completely English
  if (lang !== 'en') {
    // Let's do some common structural replacements
    const wordSwaps: Record<string, Partial<Record<TargetLanguage, string>>> = {
      "Combination of sardines provides": {
        tl: "Ang sardinas ay nagbibigay ng masustansyang",
        bis: "Ang sardinas nagahatag og masustansyang"
      },
      "provides abundant protein and iron": {
        tl: "saganang pampalaki ng buto at pampasigla ng dugo",
        bis: "daghang protina para mokusog ug pampakusog sa dugo"
      },
      "while Kalabasa adds vitamin A": {
        tl: "habang ang kalabasa naman ay nagbibigay ng Vitamin A para sa malinis na mata",
        bis: "samtang ang kalabasa nagadugang og Bitamina A para sa hayag nga panan-aw"
      },
      "sardines provides abundant protein": {
        tl: "sardinas ay mayaman sa protina",
        bis: "sardinas puno kaayo sa protina ug kusog"
      },
      "Malunggay is a local powerhouse of iron and calcium": {
        tl: "Ang malunggay ay mabisang pampasigla ng dugo at pampatibay ng bukog o buto sa inyong bakuran",
        bis: "Ang kamunggay gamhanan kaayo nga pampakusog sa dugo ug pampatig-a sa bukog sa inyong tugkaran"
      },
      "Highly effective for restoring muscle": {
        tl: "Tunay na mabuti para magkalaman ang payat na bata",
        bis: "Maayo kaayo aron motambok ug magka-unod ang payat nga bata"
      },
      "Excellent calorie-dense digestible carbohydrate base.": {
        tl: "Napakahusay na pagkain na nagbibigay ng enerhiya na magaan sa tiyan at madaling tunawin.",
        bis: "Maayo kaayong pagkaon nga dali hilison ug nagahatag og saktong kusog sa bata."
      },
      "The egg serves as a gold-standard source of essential amino acids and lipids.": {
        tl: "Ang sariwang itlog ay pinakamahusay na pagkain para sa mabilis na paglaki ng dumi at kalamnan ng inyong sanggol.",
        bis: "Ang itlog maoy pinakamaayong pagkaon para paspas nga pagdako sa lawas sa inyong anak."
      },
      "Provides a smooth calorie-rich comfort porridge suited for weak children recovering from illness.": {
        tl: "Inihahanda nito ang malambot na lugaw na madaling ubusin, angkop para sa batang medyo mahina o kagagaling sa ubo't sipon.",
        bis: "Nagahatag og humok ug lamiang lugaw nga swak kaayo sa bata nga bag-ong naulian gikan sa hilanat."
      },
      "Fills the calorie gap via energy-dense sweet potato.": {
        tl: "Pinupunan ang kakulangan sa lakas sa pamamagitan ng masustansyang kamote.",
        bis: "Nagasulbad sa kakulang sa kusog pinaagi sa kamote nga pampatambok."
      },
      "Eggs build immunity cells while malunggay reinforces hemoglobin synthesis.": {
        tl: "Ang itlog ay nagbibigay-panlaban sa ubo't lagnat habang ang malunggay naman ay nagpapasigla ng kaniyang pulang dugo.",
        bis: "Ang itlog nagahatag og kusog laban sa sakit samtang ang kamunggay nagadala og saktong dagan sa dugo."
      },
      "High in fat-soluble vitamins and calorie density, crucial for rapid weight recovery.": {
        tl: "Siksik sa likas na bitamina at lakas na kailangan para mabilis na sumigla at bumigat ang timbang.",
        bis: "Daghan kaayo og bitamina ug sustansya nga importante para daling modako ug mosaka ang timbang."
      },
      "Section selected rations across three equal feeds.": {
        tl: "Hatiin ang inyong mga sangkap para sa tatlong kainan sa isang araw — almusal, tanghalian, at hapunan.",
        bis: "Bahina ang mga sagol para sa tulo ka kaon sa tibuok adlaw (buntag, udto, ug hapon)."
      },
      "Give 1/3 of proteins at breakfast mixed with warm carbohydrate mashes.": {
        tl: "Ibigay ang unang bahagi sa almusal, ihalo sa mainit o malambot na kanin.",
        bis: "Ihatag ang unang bahin sa pamahaw, isagol sa init nga lugaw."
      },
      "Maintain 1/3 for lunch and dinner respectively.": {
        tl: "Itabi naman ang natitirang bahagi para sa tanghalian at hapunan.",
        bis: "Itago ang uban nga bahin para sa paniudto ug panihapon."
      },
      "Use clean boiled water with a pinch of salt to form a light 'sabaw'.": {
        tl: "Gumamit palagi ng malinis na pinakuluang tubig na may kaunting asin para maging sabaw.",
        bis: "Gamit og limpyo nga gipabukalan nga tubig ug butngi og gamayng asin aron mahimong lamiang sabaw."
      },
      "This swells cooked rice starch and creates a comfortable, easily-digestible wet base that expands volume.": {
        tl: "Ito ay nagpapalaki sa kanin para maging madaling kainin at mas nakakabusog para kay baby.",
        bis: "Kini nagapadako sa bugas aron mahimo kining humok, makabusog, ug sayon hilison sa tiyan sa bata."
      },
      "When serving, carefully skim the solid food items (sardine fat/oils, egg bits, or mashed soft squash) into the underweight child's bowl.": {
        tl: "Kapag pakakainin na, unahing ilagay ang mga solidong parte (gaya ng sardinas, itlog, o durog na kalabasa) sa mangkok ng batang pinapalakas natin.",
        bis: "Inig pakaon na, unaha og silyo o pili-a ang mga solidong parte (sama sa sardinas, itlog, o kalabasa) diritso sa panaksan sa bata nga nagapa-alim."
      },
      "Give other siblings the tasty hydrating broth.": {
        tl: "Ang masarap na sabaw naman ay maaring ibahagi sa ibang mga kapatid upang sila ay makahigop din ng sustansya.",
        bis: "Ang nahibiling sabaw pwede ihatag sa laing mga igsoon aron duna pud silay masustansyang mahigop."
      }
    };

    for (const [eng, translations] of Object.entries(wordSwaps)) {
      if (resultString.includes(eng)) {
        const replacement = translations[lang];
        if (replacement) {
          resultString = resultString.replaceAll(eng, replacement);
        }
      }
    }
  }

  return resultString;
}

/**
 * Translates ingredient names into highly friendly maternal local language
 */
export function translateIngredient(name: string, lang: TargetLanguage): string {
  const normalized = name.trim();
  if (INGREDIENT_TRANSLATIONS[normalized]) {
    return INGREDIENT_TRANSLATIONS[normalized][lang];
  }
  
  // Regex cleaning fallback
  let display = normalized;
  if (lang === 'tl') {
    display = display.replace(/Squash \(Kalabasa\)/gi, "Kalabasa (Pampalinaw ng mata)")
                     .replace(/Canned Sardines \(Tomato Sauce\)/gi, "Sardinas sa Kamatis (Protina at iron)")
                     .replace(/Fresh Chicken Egg/gi, "Sariwang Itlog ng Manok (Pampalaki ng kalamnan)")
                     .replace(/Malunggay Leaves \(Moringa\)/gi, "Dahon ng Malunggay (Pampasigla ng dugo)")
                     .replace(/NFA Rice/gi, "Bigas o Lugaw (Sustansya para maging malakas)")
                     .replace(/Kamote \(Sweet Potato\)/gi, "Kamote (Mataas sa enerhiya, masarap)")
                     .replace(/Water/gi, "Malinis na Tubig")
                     .replace(/Salt/gi, "Kaunting Asin")
                     .replace(/Cooking Oil/gi, "Patak ng Mantika")
                     .replace(/Moringa Leaves/gi, "Dahon ng Malunggay")
                     .replace(/Sweet Potato/gi, "Kamote");
  } else if (lang === 'bis') {
    display = display.replace(/Squash \(Kalabasa\)/gi, "Kalabasa (Para sa hayag nga panan-aw)")
                     .replace(/Canned Sardines \(Tomato Sauce\)/gi, "Sardinas sa Kamatis (Protina alang sa unod)")
                     .replace(/Fresh Chicken Egg/gi, "Presko nga Itlog sa Manok (Pampadali og dako)")
                     .replace(/Malunggay Leaves \(Moringa\)/gi, "Dahon sa Kamunggay (Pampakusog sa dugo)")
                     .replace(/NFA Rice/gi, "Bugas o Lugaw (Alang sa kusog sa bata)")
                     .replace(/Kamote \(Sweet Potato\)/gi, "Kamote (Lamiang pampatambok)")
                     .replace(/Water/gi, "Limpyo nga Tubig")
                     .replace(/Salt/gi, "Gamay nga Asin")
                     .replace(/Cooking Oil/gi, "Gamay nga Mantika")
                     .replace(/Moringa Leaves/gi, "Dahon sa Kamunggay")
                     .replace(/Sweet Potato/gi, "Kamote");
  } else {
    // English simplified
    display = display.replace(/Squash \(Kalabasa\)/gi, "Squash / Kalabasa (Vitamin A for eyes)")
                     .replace(/Canned Sardines \(Tomato Sauce\)/gi, "Canned Sardines in tomato sauce (Protein for muscles)")
                     .replace(/Fresh Chicken Egg/gi, "Fresh Chicken Egg (Growth builder)")
                     .replace(/Malunggay Leaves \(Moringa\)/gi, "Fresh Malunggay leaves (Iron booster)")
                     .replace(/NFA Rice/gi, "Rice (Easy-to-digest energy source)")
                     .replace(/Kamote \(Sweet Potato\)/gi, "Sweet Potato / Kamote (Calorie booster)");
  }

  return display;
}

export function getUIText(key: string, lang: TargetLanguage): string {
  if (UI_LABELS[key] && UI_LABELS[key][lang]) {
    return UI_LABELS[key][lang];
  }
  return key;
}
