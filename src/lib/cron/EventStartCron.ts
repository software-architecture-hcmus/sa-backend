import * as cron from 'node-cron'
import EventsService from '../../modules/events/events.s';
import logger from '../../utils/logger';

class EventStartCron {

    private readonly task: cron.ScheduledTask;

    constructor() {
        this.task = cron.schedule('* * * * *', async () => {
            try {
                await this.checkAndNotifyEventStart();
            } catch (error: any) {
                logger.error('Error in event start cron: ' + error.message);
            }
        },{
            scheduled: false,
        });
    }

    private async checkAndNotifyEventStart() {
        console.log("Checking for events starting within 5 minutes");
        const events = await EventsService.getEventsStartWithin5Minutes();
        for (const event of events) {
            await EventsService.notifyStart(event.id);
        }
    }

    run() {
        this.task.start();
        logger.info('Event start cron started');
    }

    stop() {
        this.task.stop();
        logger.info('Event start cron stopped');
    }
}

export default new EventStartCron();
