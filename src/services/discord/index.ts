import { config } from '../../config';

let hasWarnedUnconfigured = false;

export async function sendMessage(message: string): Promise<void> {
  const { webhookUrl, botToken, channelId } = config.discord;

  // Option 1: Discord Webhook URL (Recommended & Simple)
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        throw new Error(`Discord Webhook HTTP status: ${response.status}`);
      }

      console.log('Discord notification sent successfully via Webhook.');
      return;
    } catch (error) {
      console.error('Error sending Discord notification via Webhook:', (error as Error).message);
      return;
    }
  }

  // Option 2: Discord Bot API (Token + Channel ID)
  if (botToken && channelId) {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        throw new Error(`Discord Bot API status: ${response.status}`);
      }

      console.log('Discord notification sent successfully via Bot API.');
      return;
    } catch (error) {
      console.error('Error sending Discord notification via Bot API:', (error as Error).message);
      return;
    }
  }

  // Neither configured
  if (!hasWarnedUnconfigured) {
    console.info('Discord notification skipped: Neither Webhook URL nor Bot Token/Channel ID is configured.');
    hasWarnedUnconfigured = true;
  }
}
