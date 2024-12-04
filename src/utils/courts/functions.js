import { getRandomItem } from "../common/functions";
import { PLAYER_STATUS } from "../players/constants";

export const getRandomPlayers = (players, number, showAlert = true) => {
  const restPlayers = players
    .filter(
      (player) =>
        player.name &&
        (player.status === PLAYER_STATUS["REST"] ||
          ((player.status === PLAYER_STATUS["SELECTING"] ||
            player.status === PLAYER_STATUS["GAME"]) &&
            player.court === number))
    )
    .sort((a, b) => a.count - b.count || (a.time || 0) - (b.time || 0));

  if (!restPlayers || restPlayers.length < 4) {
    if (showAlert) {
      alert("人數不足，無法排場");
    }
    return;
  }

  let selectedPlayers = selectInitialPlayers(restPlayers);
  selectedPlayers = balancePlayerLevels(selectedPlayers, restPlayers);
  selectedPlayers = adjustPlayerGroups(selectedPlayers);

  return selectedPlayers;
};

const selectInitialPlayers = (restPlayers) => {
  const player0 = getRandomItem(restPlayers.slice(0, 4));
  const similarPlayers = getPlayers(player0, restPlayers).slice(0, 3);
  return [player0, ...similarPlayers];
};

const balancePlayerLevels = (selectedPlayers, restPlayers) => {
  if (!checkAllSimilarLevelsWithinRange(selectedPlayers)) {
    const player0 = selectedPlayers[0];
    const player2 = getPlayers(player0, restPlayers)[0];
    const pairPlayer = restPlayers?.filter(
      (player) => player.id !== player0.id
    );
    const player1 = getPlayers(player2, pairPlayer)[0];

    const team1Level = player0?.level + player1?.level;
    const team2Players = restPlayers?.filter(
      (player) => player.id !== player0.id && player.id !== player1.id
    );

    const team2Candidates = getTeam2Candidates(team2Players, team1Level).filter(
      (team) => team[0].id === player2.id || team[1].id === player2.id
    );

    const team2BestPair = findClosestPair(player0, player1, team2Candidates);
    const player3 = team2BestPair.find((player) => player.id !== player2.id);

    selectedPlayers = [player0, player1, player2, player3];
  }
  return selectedPlayers;
};

const adjustPlayerGroups = (selectedPlayers) => {
  const { maxPlayer, minPlayer } = findMaxMinLevelPlayers(selectedPlayers);
  const group1 = [selectedPlayers[0].id, selectedPlayers[1].id];
  const group2 = [selectedPlayers[2].id, selectedPlayers[3].id];

  if (
    (group1.includes(maxPlayer.id) && group2.includes(minPlayer.id)) ||
    (group2.includes(maxPlayer.id) && group1.includes(minPlayer.id))
  ) {
    selectedPlayers = [
      maxPlayer,
      minPlayer,
      ...selectedPlayers.filter(
        (player) => player.id !== maxPlayer.id && player.id !== minPlayer.id
      ),
    ];
  }
  return selectedPlayers;
};

const checkAllSimilarLevelsWithinRange = (players) =>
  players.every((player, i) =>
    players
      .slice(i + 1)
      .every((otherPlayer) => Math.abs(player.level - otherPlayer.level) <= 1)
  );

const getTeam2Candidates = (players, level) => {
  const pairs = [];
  for (let i = 0; i < players?.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      pairs.push({
        pair: [players[i], players[j]],
        sum: players[i].level + players[j].level,
      });
    }
  }
  return pairs
    .sort((a, b) => Math.abs(a.sum - level) - Math.abs(b.sum - level))
    .map((item) => item.pair);
};

const findClosestPair = (player0, player1, team2Candidates) => {
  const levelDifferenceA = Math.abs(player0.level - player1.level);
  let closestPair = null;
  let closestDifference = Infinity;

  team2Candidates.forEach((pair) => {
    const [player2, player3] = pair;
    const levelDifferenceB = Math.abs(player2.level - player3.level);
    const difference = Math.abs(levelDifferenceA - levelDifferenceB);

    if (difference < closestDifference) {
      closestDifference = difference;
      closestPair = pair;
    }
  });

  return closestPair;
};

const findMaxMinLevelPlayers = (players) => {
  if (!players || players.length === 0)
    return { maxPlayer: null, minPlayer: null };

  return players.reduce(
    (result, player) => ({
      maxPlayer:
        player.level > result.maxPlayer.level ? player : result.maxPlayer,
      minPlayer:
        player.level < result.minPlayer.level ? player : result.minPlayer,
    }),
    { maxPlayer: players[0], minPlayer: players[0] }
  );
};

const getPlayers = (player0, players) =>
  players
    ?.filter((player) => player?.id !== player0?.id)
    ?.sort(
      (a, b) =>
        Math.abs(player0?.level - a?.level) -
          Math.abs(player0?.level - b?.level) || a?.count - b?.count
    );
