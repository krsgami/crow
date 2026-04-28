import type { GuildMember } from "discord.js";
import { Guild } from "../utils/Guild.util.js";

type BoostTier = {
  months: number;
  emoji: string;
  tier: string;
};

const BOOST_TIERS: BoostTier[] = [
  {
    months: 24,
    emoji: Guild.emojis.boost_24,
    tier: "Tier 8",
  },
  {
    months: 18,
    emoji: Guild.emojis.boost_18,
    tier: "Tier 7",
  },
  {
    months: 12,
    emoji: Guild.emojis.boost_12,
    tier: "Tier 6",
  },
  {
    months: 9,
    emoji: Guild.emojis.boost_9,
    tier: "Tier 5",
  },
  {
    months: 6,
    emoji: Guild.emojis.boost_6,
    tier: "Tier 4",
  },
  {
    months: 3,
    emoji: Guild.emojis.boost_3,
    tier: "Tier 3",
  },
  {
    months: 2,
    emoji: Guild.emojis.boost_2,
    tier: "Tier 2",
  },
  {
    months: 1,
    emoji: Guild.emojis.boost_1,
    tier: "Tier 1",
  },
];

function getFullTime(startDate: Date, endDate = new Date()) {
  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  const monthAnchor = new Date(startDate);
  monthAnchor.setMonth(monthAnchor.getMonth() + months);

  if (monthAnchor > endDate) {
    months -= 1;
    monthAnchor.setMonth(monthAnchor.getMonth() - 1);
  }

  const remainingMs = Math.abs(endDate.getTime() - monthAnchor.getTime());

  const years = Math.floor(months / 12);
  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  return { years, months, days, hours, minutes, seconds };
}

export function getBoostBadge(member: GuildMember | null | undefined) {
  if (!member?.premiumSinceTimestamp) {
    return {
      isBooster: false,
      months: 0,
      emoji: null,
    };
  }

  const premiumSince = new Date(member.premiumSinceTimestamp);
  const months = getFullTime(premiumSince).months;
  const days = getFullTime(premiumSince).days;
  const years = getFullTime(premiumSince).years;
  const hours = getFullTime(premiumSince).hours;
  const minutes = getFullTime(premiumSince).minutes;
  const seconds = getFullTime(premiumSince).seconds;

  const tier =
    BOOST_TIERS.find((tier) => months >= tier.months) ??
    BOOST_TIERS[BOOST_TIERS.length - 1];

  return {
    isBooster: true,
    months,
    days,
    years,
    hours,
    minutes,
    seconds,
    emoji: tier.emoji,
    tier: tier.tier,
  };
}
