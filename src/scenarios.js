// Scenario catalog + the string passed to the assistant's {{scenario}} variable.
// Each scenario carries a one-sentence situational description so the tutor can
// drop the user straight into it (the title alone isn't enough context).

export const SCENARIO_OF_THE_DAY = {
  title: "The Barcelona Bar",
  desc: "You're at a lively bar in Barcelona and the most attractive person in the room just made eye contact. You have one shot, one language, and a rapidly closing window.",
};

// Order here matches the icon list in Scenarios.jsx.
export const SCENARIOS = [
  { title: "Meeting Her Colombian Father", level: 3, desc: "You're meeting your Colombian partner's intimidating father for the first time, over dinner at his home. He's sizing you up." },
  { title: "The Jealous Argentinian Ex", level: 3, desc: "Your partner's jealous Argentinian ex has cornered you at a party and is spoiling for a fight." },
  { title: "Lying at the Venezuelan Border", level: 3, desc: "You're at a tense Venezuelan border crossing. The guard is suspicious and wants to know why you're really here." },
  { title: "Walk of Shame in Madrid", level: 2, desc: "It's 6am in Madrid and you're doing the walk of shame when you run into a nosy neighbor who has questions." },
  { title: "The Bogotá Taxi Scam", level: 2, desc: "A Bogotá taxi driver is taking the scenic route and inflating the fare. You need to call it out and negotiate." },
  { title: "Returning the Worn Dress in Sevilla", level: 2, desc: "You're in a Sevilla boutique trying to return a dress you obviously already wore, and the shopkeeper isn't buying it." },
  { title: "Small Talk with the Roommate", level: 2, desc: "Awkward kitchen small talk with your new Spanish-speaking roommate whom you barely know." },
  { title: "The Suegra's 3-Hour Lunch", level: 3, desc: "You're trapped at your mother-in-law's endless three-hour Sunday lunch and must keep the polite conversation going." },
  { title: "Picking a Fight in a Buenos Aires Café", level: 2, desc: "Someone in a Buenos Aires café took your table and your order. Tensions escalate into an argument." },
  { title: "Lost in the Amazonas", level: 3, desc: "You're lost in the Amazonas and must ask locals for directions and help before dark." },
];

// The value handed to vapi.start's variableValues.scenario. "" = free chat.
export function scenarioText(title, desc) {
  if (!title && !desc) return "";
  return desc ? `${title}. ${desc}` : title;
}
