const getCrazyGamesAPI = () => {
  if (typeof window === "undefined") return null
  return window.CrazyGames?.SDK ?? null
}

export const crazyGamesLoadingStart = () => {
  getCrazyGamesAPI()?.game?.loadingStart?.()
}

export const crazyGamesLoadingStop = () => {
  getCrazyGamesAPI()?.game?.loadingStop?.()
}

export const crazyGamesGameplayStart = () => {
  getCrazyGamesAPI()?.game?.gameplayStart?.()
}

export const crazyGamesGameplayStop = () => {
  getCrazyGamesAPI()?.game?.gameplayStop?.()
}

export const crazyGamesRequestMidgameAd = ({ onAdStarted, onAdFinished } = {}) => {
  const sdk = getCrazyGamesAPI()
  if (!sdk?.game?.requestAd) {
    onAdStarted?.()
    onAdFinished?.()
    return
  }

  sdk.game.requestAd({
    adType: "midgame",
    adStarted: () => {
      onAdStarted?.()
    },
    adFinished: () => {
      onAdFinished?.()
    },
    adError: () => {
      onAdFinished?.()
    }
  })
}
