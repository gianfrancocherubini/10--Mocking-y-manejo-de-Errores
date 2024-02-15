import { TicketEsquema } from "./models/ticket.model.js";

export class ticketMongoDao {

    async generateTicketCode() {
        const lastTicket = await TicketEsquema.findOne().sort({ code: -1 });
        const nextTicketNumber = lastTicket ? parseInt(lastTicket.code.replace('TICKET-', '')) + 1 : 1;
        return `TICKET-${nextTicketNumber}`;
    }

    async createTicket(purchaserEmail, totalAmount) {
        const ticketCode = await this.generateTicketCode(); 
        const ticket = new TicketEsquema({
            code: ticketCode,
            purchaser: purchaserEmail,
            purchase_datetime: new Date(),
            amount: totalAmount
        });
        await ticket.save();
        return ticket;
    }
}