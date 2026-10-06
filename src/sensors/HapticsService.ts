import * as Haptics from 'expo-haptics';

export class HapticsService {
  private static lastTrigger = 0;

  /**
   * Triggers haptic feedback based on angular proximity to celestial target
   * distance < 1° -> Heavy impact (target locked)
   * distance < 3° -> Medium impact (getting closer)
   * distance < 10° -> Light impact (in vicinity)
   */
  public static async triggerTargetProximity(angularDistDeg: number): Promise<void> {
    const now = Date.now();
    // Throttle haptics so user doesn't get constant buzzing
    if (now - this.lastTrigger < 350) return;

    try {
      if (angularDistDeg < 1.5) {
        this.lastTrigger = now;
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (angularDistDeg < 4.0) {
        this.lastTrigger = now;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (angularDistDeg < 10.0) {
        this.lastTrigger = now;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      // Haptics might fail on simulator or unsupported devices; silently ignore
    }
  }

  public static async triggerClick(): Promise<void> {
    try {
      await Haptics.selectionAsync();
    } catch {
      // Silent fail
    }
  }

  public static async triggerSuccess(): Promise<void> {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Silent fail
    }
  }
}
