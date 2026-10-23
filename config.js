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
    {t:"Scheme Requirements & Guidelines", b:"<p>Describe your scheme here.</p><div class='warn'><b>Warning</b>Any abuse of the Illegal Civilian Scheme will result in removal.</div><ul><li>Rule one</li><li>Rule two</li></ul>"},
    {t:"Scheme Drop Schedule & Weapon Regulations", b:"<p>Drop days, weapon tiers, etc.</p>"},
    {t:"Faction Rules of Engagement", b:"<p>Your rules of engagement.</p>"},
    {t:"Weapon & Ammunition Transaction Limits", b:"<p>Your limits.</p>"}
  ],
  // Weapon spin. r = rarity stars 1-5. img = file in assets/weapons/
  tiers: [
    {name:"Tier 1", weapons:[
      {n:"Glock 43X", img:"assets/weapons/WEAPON_ILLEGALGLOCK43X.png", r:2},
      {n:"Glock 17 Red Switch", img:"assets/weapons/WEAPON_GLOCK17REDSWITCH.png", r:2},
      {n:"Glock 19 G5", img:"assets/weapons/WEAPON_GLOCK19GEN5.png", r:3}]},
    {name:"Tier 1.5", weapons:[
      {n:"Weapon A", img:"assets/weapons/a.png", r:3},
      {n:"Weapon B", img:"assets/weapons/b.png", r:2}]},
    {name:"Tier 2", weapons:[
      {n:"Weapon C", img:"assets/weapons/c.png", r:3},
      {n:"Weapon D", img:"assets/weapons/d.png", r:4}]}
  ],
  spinAmounts: [1,2,3,4,5,6,7,8,9,10]
};
