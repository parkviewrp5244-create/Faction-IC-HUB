// ====== EDIT THIS FILE ONLY ======
window.CONFIG = {
  name: "Faction Hub",
  tagline: "The home of the Faction Scheme. Read the rules, submit your faction thread.",
  footer: "SOLS V2 · FACTION MANAGEMENT",
  logo: "assets/logo.png",
  bg: "assets/bg.jpg",
  // Firebase (free). Needed for applications, admin, Threads and the forum.
  firebase: { apiKey:"AIzaSyBYf0bYRUUzWyhRYwFafQaie-DzeNAysmw", authDomain:"faction-ic-hub.firebaseapp.com", projectId:"faction-ic-hub", appId:"1:644989604483:web:7ce067e55cece017b381b6" },
  // Optional: Discord login for the forum (see setup notes). Leave empty to keep the Forums button hidden.
  discord: { clientId:"", guildId:"" },
  // Optional: free Cloudinary account so players can upload videos in Threads. Leave empty to allow image uploads and links only.
  cloudinary: { cloud:"", preset:"" },
  boroughs: ["Southside","Eastside","Westside","Northside"],
  // Thread submission questions (add/remove freely)
  questions: [
    "What is your faction name and nicknames if any",
    "Describe your factions backstory and how it started.",
    "Who are your founding members and their roles? Put discord names not display names and what role they have.",
    "Which area/turf do you want to claim and why?",
    "What will your group do to create RP (not just violence)?"
  ],
  // ROE sections: t = title, b = HTML body
  roe: [
    {t:"Scheme Requirements & Guidelines", b:"<p>Read About The Requirments Below.</p><div class='warn'><b>Warning</b>Any abuse of the Illegal Faction Scheme will result in removal.</div><ul><li>To Qualify For The Illegal Faction Scheme Your Faction Must Have Some Sort Of Roleplay Built Up And Logged, Read Below For What This Includes.</li><li>Interactions, Screens, Newspapers, Block Partys / Block Events And Must Have Quality Serious Roleplay</li></ul>"},
    {t:"Scheme Drop Schedule & Weapon Regulations", b:"<p>Drug And Weapon Drops Will Take Place Every Friday, Every Faction Tier Including Tier 1, Tier 1.5, Tier 2 Recieves A Different Amount Of Weapons Every Drop. Tier 1 Receives 6, Tier 1.5 Receives 8, Tier 2 Receives 10. etc.</p>"},
    {t:"Faction Rules of Engagement", b:"<p><a href='https://docs.google.com/document/d/1B5pCV5nVcyfHL2DLUaj8uQJaiE-C00UBI5wxuVLnQqk/edit?usp=sharing' target='_blank' rel='noopener'>Open the Rules of Engagement document</a></p>"},
    {t:"Weapon & Ammunition Transaction Limits", b:"<p>Tier 1 Factions Are Limited To Trading 1 Weapon Every 7 Days, Limited To Selling // Buying 2 Weapons Every 7 Days. Tier 1.5 Is Limited To Trading 2 Weapons Every 7 Days, Limited To Selling // Buying 4 Weapons Every 7 Days. Tier 2 Is Limited To Trading 4 Weapons Every 7 Days, Limited To Selling // Buying 6 Weapons Every 7 Days.</p>"}
  ],
  // Weapon spin. r = rarity stars 1-5. img = file in assets/weapons/
  tiers: [
    {name:"Tier 1", weapons:[
      {n:"1911", img:"assets/weapons/WEAPON_1911.png", r:5},
      {n:"Canik TP9", img:"assets/weapons/WEAPON_CANIK.png", r:2},
      {n:"Glock CPT", img:"assets/weapons/WEAPON_CPT.png", r:2},
      {n:"Fabrique Nationale", img:"assets/weapons/WEAPON_FFN.png", r:2},
      {n:"Glock 26", img:"assets/weapons/WEAPON_G26.png", r:2},
      {n:"Glock 19 Grip", img:"assets/weapons/WEAPON_G19G.png", r:2},
      {n:"Glock 43 Grip", img:"assets/weapons/WEAPON_G43G.png", r:2},
      {n:"HK45 Sidearm", img:"assets/weapons/WEAPON_HK45.png", r:2},
      {n:"G43 G", img:"assets/weapons/WEAPON_G43G.png", r:2},
      {n:"HK45", img:"assets/weapons/WEAPON_HK45.png", r:3},
      {n:"Olive Glock 17", img:"assets/weapons/WEAPON_OLIVE17.png", r:2},
      {n:"Olive Glock 19", img:"assets/weapons/WEAPON_OLIVEG19.png", r:2},
      {n:"P88P", img:"assets/weapons/WEAPON_P88P.png", r:2}]},
    {name:"Tier 1.5", weapons:[
      {n:"Callous", img:"assets/weapons/WEAPON_CALLOUS.png", r:3},
      {n:"Glock 45", img:"assets/weapons/WEAPON_G45S.png", r:3},
      {n:"Glock 23", img:"assets/weapons/WEAPON_G233.png", r:2},
      {n:"Mac-10", img:"assets/weapons/WEAPON_MAC10.png", r:2},
      {n:"Tec-9", img:"assets/weapons/WEAPON_TEC9.png", r:2},
      {n:"Glock 19 With A Switch", img:"assets/weapons/WEAPON_19SWITCH.png", r:2},
      {n:"Glock 43 MOS", img:"assets/weapons/WEAPON_43MOS.png", r:2},
      {n:"Glock 45 MOS", img:"assets/weapons/WEAPON_45MOS.png", r:2},
      {n:"Fabrique Nationale 2.0", img:"assets/weapons/WEAPON_FN.png", r:2},
      {n:"Glock 26 With A Switch", img:"assets/weapons/WEAPON_G26S.png", r:3}]},
    {name:"Tier 2", weapons:[
      {n:"Glock AP3", img:"assets/weapons/WEAPON_AP3.png", r:4},
      {n:"Glock 205 Switch", img:"assets/weapons/WEAPON_G205.png", r:4},
      {n:"4 Inch ARP", img:"assets/weapons/WEAPON_ARPSH.png", r:4},
      {n:"Draco", img:"assets/weapons/WEAPON_DRACOZ.png", r:2},
      {n:"Draco Black", img:"assets/weapons/WEAPON_DRACO2.png", r:2},
      {n:"Kriss Vector", img:"assets/weapons/WEAPON_KVEC.png", r:4},
      {n:"MAC-10", img:"assets/weapons/WEAPON_MAC10.png", r:4},
      {n:"MCX", img:"assets/weapons/WEAPON_MCX.png", r:4}]}
  ],
  spinAmounts: [1,2,3,4,5,6,7,8,9,10]
};
