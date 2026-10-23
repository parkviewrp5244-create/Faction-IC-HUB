// ====== EDIT THIS FILE ONLY ======
window.CONFIG = {
  name: "Faction Hub",
  tagline: "The home of the Faction Scheme. Read the rules, submit your faction thread.",
  footer: "SOLS V2 · FACTION MANAGEMENT",
  logo: "assets/logo.png",
  bg: "assets/bg.jpg",
  // Firebase (free) - see README. Needed for submissions + admin + map turfs.
  firebase: { apiKey:"AIzaSyBYf0bYRUUzWyhRYwFafQaie-DzeNAysmw", authDomain:"faction-ic-hub.firebaseapp.com", projectId:"faction-ic-hub", appId:"1:644989604483:web:7ce067e55cece017b381b6" },
  // Map image size in pixels (the width/height of assets/map.jpg)
  map: { img:"assets/map.jpg", w:1024, h:1536, start:{x:720, y:2080, zoom:1} },
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
    {t:"Faction Rules of Engagement", b:"<p>https://docs.google.com/document/d/1B5pCV5nVcyfHL2DLUaj8uQJaiE-C00UBI5wxuVLnQqk/edit?usp=sharing</p>"},
    {t:"Weapon & Ammunition Transaction Limits", b:"<p>Tier 1 Factions Are Limited To Trading 1 Weapon Every 7 Days, Limited To Selling // Buying 2 Weapons Every 7 Days. Tier 1.5 Is Limited To Trading 2 Weapons Every 7 Days, Limited To Selling // Buying 4 Weapons Every 7 Days. Tier 2 Is Limited To Trading 4 Weapons Every 7 Days, Limited To Selling // Buying 6 Weapons Every 7 Days.</p>"}
  ],
  // Weapon spin. r = rarity stars 1-5. img = file in assets/weapons/
  tiers: [
    {name:"Tier 1", weapons:[
      {n:"1911", img:"assets/weapons/WEAPON_1911.png", r:2},
      {n:"Glock 17", img:"assets/weapons/WEAPON_GLOCK17.png", r:2},
      {n:"Glock 19 Gen 5", img:"assets/weapons/WEAPON_GLOCK19GEN5.png", r:2},
      {n:"Glock 19X", img:"assets/weapons/WEAPON_GLOCK19X.png", r:2},
      {n:"Glock 19XB", img:"assets/weapons/WEAPON_GLOCK19XB.png", r:2},
      {n:"Glock 21 Gen 5", img:"assets/weapons/WEAPON_GLOCK21GEN5.png", r:2},
      {n:"Glock 22", img:"assets/weapons/WEAPON_GLOCK22.png", r:2},
      {n:"Glock 40", img:"assets/weapons/WEAPON_GLOCK40.png", r:3},
      {n:"Glock 45", img:"assets/weapons/WEAPON_GLOCK45.png", r:3},
      {n:"Glock Camo", img:"assets/weapons/WEAPON_GLOCKCAMO.png", r:3},
      {n:"PX4", img:"assets/weapons/WEAPON_PX4.png", r:2},
      {n:"Sig P365X", img:"assets/weapons/WEAPON_SIGP365X.png", r:3}]},
    {name:"Tier 1.5", weapons:[
      {n:"Glock 17 Gen 3 Switch", img:"assets/weapons/WEAPON_GLOCK17GEN3SWITCH.png", r:3},
      {n:"Glock 17 Gen 4 Switch", img:"assets/weapons/WEAPON_GLOCK17GEN4SWITCH.png", r:3},
      {n:"Glock 17 Gen 5 Switch", img:"assets/weapons/WEAPON_GLOCK17GEN5SWITCH.png", r:3},
      {n:"Glock 17 Blue Switch", img:"assets/weapons/WEAPON_GLOCK17BLUESWITCH.png", r:3},
      {n:"Glock 17 Grey Switch", img:"assets/weapons/WEAPON_GLOCK17GREYSWITCH.png", r:3},
      {n:"Glock 17 Red Switch", img:"assets/weapons/WEAPON_GLOCK17REDSWITCH.png", r:3},
      {n:"Glock 19 Gen 5 Switch", img:"assets/weapons/WEAPON_GLOCK19GEN5SWITCH.png", r:3},
      {n:"Glock 26 Switch", img:"assets/weapons/WEAPON_GLOCK26SWITCH.png", r:3},
      {n:"Glock 18C", img:"assets/weapons/WEAPON_GLOCK18C.png", r:4},
      {n:"Illegal Glock 43X", img:"assets/weapons/WEAPON_ILLEGALGLOCK43X.png", r:4}]},
    {name:"Tier 2", weapons:[
      {n:".223 ARP Pistol", img:"assets/weapons/WEAPON_223ARPISTOL.png", r:4},
      {n:"Black ARP", img:"assets/weapons/WEAPON_BLACKARP.png", r:4},
      {n:"Blue ARP 7.62", img:"assets/weapons/WEAPON_BLUEARP762.png", r:5},
      {n:"SKARP", img:"assets/weapons/WEAPON_SKARP.png", r:4},
      {n:"WTARP", img:"assets/weapons/WEAPON_WTARP.png", r:4},
      {n:"ZPAP92", img:"assets/weapons/WEAPON_ZPAP92.png", r:5},
      {n:"Micro Draco", img:"assets/weapons/WEAPON_MICRODRACO.png", r:4},
      {n:"Black Micro Draco", img:"assets/weapons/WEAPON_BLACKMICRODRACO.png", r:5}]}
  ],
  spinAmounts: [1,2,3,4,5,6,7,8,9,10]
};
