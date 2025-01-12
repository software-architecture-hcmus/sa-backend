import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GAME_STATE_INIT, WEBSOCKET_SERVER_PORT } from "./config"
import Manager from "./roles/manager"
import Player from "../../modules/player/player.s"
import { abortCooldown } from "./utils/cooldown"
import deepClone from "./utils/deepClone"
import { SOCKET_JOIN_USER_ROOM } from "../../shared/constants/socket-event";
import logger from "../../utils/logger";
const manager = new Map();
const players = new Map()
let gameState = deepClone(GAME_STATE_INIT)
export const initEvents = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on('connection', (socket) => {
        console.log(`${socket.id} is connected`);

        socket.on("player:join", (player) =>
          Player.join(io, socket, player, manager, players ),
        )
      
        // socket.on("manager:kickPlayer", (playerId) =>
        //   Manager.kickPlayer(gameState, io, socket, playerId),
        // )
      
        socket.on("manager:startGame", (id) => Manager.startGame(io, socket, id, players))
      
        socket.on("player:selectedAnswer", (data) =>
          Player.selectedAnswer(io, socket, data, manager),
        )
      
        socket.on("manager:abortQuiz", () => Manager.abortQuiz(gameState, io, socket))

        socket.on("manager:joinRoom", (id)=>Manager.joinRoom(io,socket,id, manager))

        socket.on("manager:nextQuestion", (id) =>
          Manager.nextQuestion(id, io, socket, players),
        )
      
        socket.on("manager:showLeaderboard", (id) =>
          Manager.showLoaderboard(io, socket, id, players),
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