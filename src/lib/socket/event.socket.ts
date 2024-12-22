import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GAME_STATE_INIT, WEBSOCKET_SERVER_PORT } from "./config"
import Manager from "./roles/manager"
import Player from "../../modules/player/player.s"
import { abortCooldown } from "./utils/cooldown"
import deepClone from "./utils/deepClone"
import { SOCKET_JOIN_USER_ROOM } from "../../shared/constants/socket-event";
import logger from "../../utils/logger";

let gameState = deepClone(GAME_STATE_INIT)
export const initEvents = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on('connection', (socket) => {
        console.log(`${socket.id} is connected`);

        socket.on("player:checkRoom", (roomId, gameID) =>
          Player.checkRoom(io, socket, roomId, gameID),
        )
        socket.on("player:join", (player, gameID) =>
          Player.join(io, socket, player, gameID),
        )
      
        socket.on("manager:createRoom", (password) =>
          Manager.createRoom(gameState, io, socket, password),
        )
        socket.on("manager:kickPlayer", (playerId) =>
          Manager.kickPlayer(gameState, io, socket, playerId),
        )
      
        socket.on("manager:startGame", () => Manager.startGame(gameState, io, socket))
      
        socket.on("player:selectedAnswer", (answerKey, gameID, playerID, roundStartTime) =>
          Player.selectedAnswer(io, socket, answerKey, gameID, playerID, roundStartTime),
        )
      
        socket.on("manager:abortQuiz", () => Manager.abortQuiz(gameState, io, socket))
      
        socket.on("manager:nextQuestion", () =>
          Manager.nextQuestion(gameState, io, socket),
        )
      
        socket.on("manager:showLeaderboard", () =>
          Manager.showLoaderboard(gameState, io, socket),
        )
      
        socket.on("disconnect", () => {
          console.log(`user disconnected ${socket.id}`)
          if (gameState.manager === socket.id) {
            console.log("Reset game")
            io.to(gameState.room).emit("game:reset")
            gameState.started = false
            gameState = deepClone(GAME_STATE_INIT)
      
            abortCooldown()
      
            return
          }
      
          const player = gameState.players.find((p) => p.id === socket.id)
      
          if (player) {
            gameState.players = gameState.players.filter((p) => p.id !== socket.id)
            socket.to(gameState.manager).emit("manager:removePlayer", player.id)
          }
        })
        socket.on(SOCKET_JOIN_USER_ROOM, (data: {id: string}) => {
            socket.join(data.id);
            logger.info(`${socket.id} joined room ${data.id}`);
        })

        socket.on("stream", (data: any) => {
            console.log(data);
            io.emit('stream', data);
        })
    })
}