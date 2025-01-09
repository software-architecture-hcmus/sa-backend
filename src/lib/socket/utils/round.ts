import { cooldown, sleep } from "./cooldown"
import manager from "../roles/manager";
export const startRound = async (game, io, socket, id) => {
  const question = game.currentQuestion;
  if (!game.started) return

  io.to(id).emit("game:updateQuestion", {
    current: question.position + 1,
    total: game.questions.length,
  })

  io.to(id).emit("game:status", {
    name: "SHOW_PREPARED",
    data: {
      totalAnswers: question.answers.length,
      questionNumber: question.position + 1,
    },
  })

  await sleep(2)

  if (!game.started) return

  io.to(id).emit("game:status", {
    name: "SHOW_QUESTION",
    data: {
      question: question.content,
      image: question.image,
      cooldown: question.cooldown,
    },
  })

  await sleep(question.cooldown)

  if (!game.started) return

  game.roundStartTime = Date.now()

  io.to(id).emit("game:status", {
    name: "SELECT_ANSWER",
    data: {
      question: question.content,
      answers: question.answers.map(answer=> answer.content),
      image: question.image,
      time: question.time,
      totalPlayer: game.players.length,
    },
  })

  await cooldown(question.time, io, id)

  if (!game.started) return
  const PlayerAnswer = await manager.getPlayerAnswer(question.id);

  game.players.map(async (player) => {
    let playerAnswer =  PlayerAnswer.find((p) => p.customer_id === player.customer_id)

    let isCorrect = playerAnswer
      ? playerAnswer.answer === question.solution
      : false

    let points = (isCorrect && Math.round(playerAnswer?.point ?? 0)) || 0;

    player.point += points

    let sortPlayers = game.players.sort((a, b) => b.point - a.point)

    let rank = sortPlayers.findIndex((p) => p.customer_id === player.customer_id) + 1
    let aheadPlayer = sortPlayers[rank - 2]

    io.to(player.customer_id).emit("game:status", {
      name: "SHOW_RESULT",
      data: {
        correct: isCorrect,
        message: isCorrect ? "Nice !" : "Too bad",
        points: points,
        myPoints: player.point,
        rank,
        aheadOfMe: aheadPlayer ? aheadPlayer.username : null,
      },
    })
  })

  let totalType = {}

  PlayerAnswer.forEach(({ answer }) => {
    totalType[answer.id] = (totalType[answer.id] || 0) + 1
  })

  // Manager
  io.to(game.manager).emit("game:status", {
    name: "SHOW_RESPONSES",
    data: {
      question: question.question,
      responses: totalType,
      correct: question.solution,
      answers: question.answers,
      image: question.image,
    },
  })
}
