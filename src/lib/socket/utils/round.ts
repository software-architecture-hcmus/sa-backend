import { cooldown, sleep } from "./cooldown"
import manager from "../roles/manager";
import playerS from "../../../modules/player/player.s";
export const startRound = async (game, io, socket, id, playersSockets) => {
  const question = game.currentQuestion;
  if (!game.started) return

  socket.emit("game:updateQuestion", {
    current: question.position + 1,
    total: game.questions.length,
  })
  playersSockets.forEach(element => {
    io.to(element).emit("game:updateQuestion", {
      current: question.position + 1,
      total: game.questions.length,
    })
  });

  socket.emit("game:status", {
    name: "SHOW_PREPARED",
    data: {
      totalAnswers: question.answers.length,
      questionNumber: question.position + 1,
    },
  })
  playersSockets.forEach(element => {
    io.to(element).emit("game:status", {
      name: "SHOW_PREPARED",
      data: {
        totalAnswers: question.answers.length,
        questionNumber: question.position + 1,
      },
    })
  });
  await sleep(2)

  if (!game.started) return

  socket.emit("game:status", {
    name: "SHOW_QUESTION",
    data: {
      question: question.content,
      image: question.image,
      cooldown: question.cooldown,
    },
  })
  playersSockets.forEach(element => {
    io.to(element).emit("game:status", {
      name: "SHOW_QUESTION",
      data: {
        question: question.content,
        image: question.image,
        cooldown: question.cooldown,
      },
    })
  });
  await sleep(question.cooldown)

  if (!game.started) return

  game.roundStartTime = Date.now()

  socket.emit("game:status", {
    name: "SELECT_ANSWER",
    data: {
      question: question.content,
      answers: question.answers.map(answer=> answer.content),
      image: question.image,
      time: question.time,
      totalPlayer: game.players.length,
    },
  })
  playersSockets.forEach(element => {
    io.to(element).emit("game:status", {
      name: "SELECT_ANSWER",
      data: {
        question: question.content,
        answers: question.answers.map(answer=> answer.content),
        image: question.image,
        time: question.time,
        totalPlayer: game.players.length,
      },
    })
  });
  await cooldown(question.time, io, id, playersSockets, socket)

  if (!game.started) return
  const PlayerAnswer = await manager.getPlayerAnswer(question.id);
  game?.players?.map(async (player) => {
    let playerAnswer =  PlayerAnswer.find((p) => p.customer_id === player.customer_id)
    let isCorrect = playerAnswer
      ? playerAnswer?.answer?.id === question?.solution?.id
      : false
    
    let points = (isCorrect && Math.round(playerAnswer?.point ?? 0)) || 0;
    player.score += points
    console.log(player);
    await playerS.saveRoomPlayer({gameID: player.game_room_id, playerID: player.customer_id, point: player.score})

    let sortPlayers = game.players.sort((a, b) => b.point - a.point)

    let rank = sortPlayers.findIndex((p) => p.customer_id === player.customer_id) + 1
    let aheadPlayer = sortPlayers[rank - 2]
    playersSockets.forEach(element => {
      io.to(element).emit("game:status", {
        name: "SHOW_RESULT",
        data: {
          correct: isCorrect,
          message: isCorrect ? "Nice !" : "Too bad",
          points: points,
          myPoints: player.score,
          rank,
          aheadOfMe: aheadPlayer ? aheadPlayer.username : null,
          id: player.customer_id
        },
      })
    });
  })

  let totalType = {}

  PlayerAnswer.forEach(({ answer }) => {
    const index = question.answers.findIndex(currentAnswer => currentAnswer.id === answer.id)
    totalType[index] = (totalType[index] || 0) + 1
  })
  // Manager
  socket.emit("game:status", {
    name: "SHOW_RESPONSES",
    data: {
      question: question.content,
      responses: totalType,
      correct: question.answers.findIndex(answer => answer.id === question.solution.id),
      answers: question.answers.map(answer=> answer.content),
      image: question.image,
    },
  })
}
