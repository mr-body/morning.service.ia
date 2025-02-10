import dotenv from 'dotenv'; // Load environment variables
import twilio from 'twilio'; // Twilio SDK for WhatsApp

dotenv.config();

// Enviar WhatsApp usando a API do Twilio
export const sendWhatsapp = async (to: string, message: string): Promise<void> => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !fromPhone) {
        throw new Error('Twilio environment variables are not set');
    }

    const client = twilio(accountSid, authToken);

    try {
        const msg = await client.messages.create({
            from: `whatsapp:${fromPhone}`, // Seu número Twilio de WhatsApp
            body: message, // Mensagem
            to: `whatsapp:${to.replace(/\D/g, '')}`, // Número do destinatário
        });
        console.log(`Mensagem enviada com sucesso! SID: ${msg.sid}`);
    } catch (error: any) {
        console.error(`Erro ao enviar mensagem: ${error.message}`);
        throw error;
    }
};