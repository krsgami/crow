export async function getRoleManagedInfo(role) {
    if (!role.managed) {
        return "Não";
    }
    if (role.tags?.integrationId) {
        return `Sim, por integração \`${role.tags.integrationId}\``;
    }
    if (role.tags?.botId) {
        return `Sim, por bot \`${role.tags.botId}\``;
    }
    if (role.tags?.premiumSubscriberRole !== undefined) {
        return "Sim, por Nitro Booster";
    }
    if (role.tags?.subscriptionListingId) {
        return `Sim, por assinatura \`${role.tags.subscriptionListingId}\``;
    }
    return "Sim";
}
//# sourceMappingURL=role.function.js.map