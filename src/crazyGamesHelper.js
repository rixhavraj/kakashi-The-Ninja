let isInitialized = false

const getCrazyGamesAPI = () => {
  if (typeof window === "undefined") return null
  return window.CrazyGames?.SDK ?? null
}

export const initCrazyGamesSDK = async () => {
  const sdk = getCrazyGamesAPI()
  if (!sdk) return
  
  try {
    await sdk.init()
    isInitialized = true
  } catch (error) {
    console.warn("CrazyGames SDK initialization failed:", error)
  }
}

export const crazyGamesLoadingStart = () => {
  if (!isInitialized) return
  try { getCrazyGamesAPI()?.game?.loadingStart?.() } catch (e) { console.warn(e) }
}

export const crazyGamesLoadingStop = () => {
  if (!isInitialized) return
  try { getCrazyGamesAPI()?.game?.loadingStop?.() } catch (e) { console.warn(e) }
}

export const crazyGamesGameplayStart = () => {
  if (!isInitialized) return
  try { getCrazyGamesAPI()?.game?.gameplayStart?.() } catch (e) { console.warn(e) }
}

export const crazyGamesGameplayStop = () => {
  if (!isInitialized) return
  try { getCrazyGamesAPI()?.game?.gameplayStop?.() } catch (e) { console.warn(e) }
}

export const crazyGamesRequestMidgameAd = ({ onAdStarted, onAdFinished } = {}) => {
  if (!isInitialized) {
    onAdStarted?.()
    onAdFinished?.()
    return
  }

  const sdk = getCrazyGamesAPI()
  if (!sdk?.game?.requestAd) {
    onAdStarted?.()
    onAdFinished?.()
    return
  }

  let hasFinished = false
  const safeFinish = () => {
    if (hasFinished) return
    hasFinished = true
    onAdFinished?.()
  }

  // Safety fallback: if the SDK throttles the ad and silently drops callbacks,
  // we ensure the game doesn't freeze permanently by waiting 0.5 seconds.
  // If the ad *actually* starts, adStarted is called, disabling this fallback.
  let adStartedCalled = false
  setTimeout(() => {
    if (!adStartedCalled && !hasFinished) {
      console.warn("CrazyGames ad request was throttled or timed out. Manually unblocking...")
      safeFinish()
    }
  }, 500)

  try {
    sdk.game.requestAd({
      adType: "midgame",
      adStarted: () => {
        adStartedCalled = true
        onAdStarted?.()
      },
      adFinished: () => {
        safeFinish()
      },
      adError: () => {
        safeFinish()
      }
    })
  } catch (e) {
    console.warn("CrazyGames midgame ad error:", e)
    safeFinish()
  }
}
