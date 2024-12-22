import { SOCKET_EVENT_NOTIFICATION } from "../../shared/constants/socket-event";
import { io } from "./gateway.socket";

export const emitEventNotification = (data: {
    event_id: string;
    content: string;
}, room?: string) => {
    if(room){
        io.to(room).emit(SOCKET_EVENT_NOTIFICATION, data);
    } else {
        io.emit(SOCKET_EVENT_NOTIFICATION, data);
    }
}
