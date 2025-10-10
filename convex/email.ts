"use node"
import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from 'resend';

const RESEND_API_KEY = "re_AxnLVB5n_CKXyxDBDmyBaTAnnkiJqCbHf";


const resend = new Resend(RESEND_API_KEY);

// Helper function pour envoyer un email de confirmation client
async function sendClientEmail(args: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  date: string;
  time: string;
  duration: number;
  address?: string;
  notes?: string;
  bookingId: string;
}) {
  const emailSubject = `Confirmation de votre rendez-vous - ${args.serviceType}`;
  const emailHtml = `
    <div style="font-family:sans-serif;line-height:1.6">
      <h2>Bonjour ${args.clientName},</h2>
      <p>Merci pour votre réservation chez DR Ravalement.</p>
      <p><b>Détails de votre rendez-vous :</b></p>
      <ul>
        <li><b>Service :</b> ${args.serviceType}</li>
        <li><b>Date :</b> ${args.date}</li>
        <li><b>Heure :</b> ${args.time}</li>
        <li><b>Durée estimée :</b> ${args.duration} minutes</li>
        ${args.address ? `<li><b>Adresse :</b> ${args.address}</li>` : ""}
        ${args.notes ? `<li><b>Notes :</b> ${args.notes}</li>` : ""}
      </ul>
      <p>Pour toute question, contactez-nous à <a href="mailto:contact@dr-ravalement.fr">contact@dr-ravalement.fr</a>.</p>
      <p>À bientôt,<br>L'équipe DR Ravalement</p>
    </div>
  `;

  try {
    const data = await resend.emails.send({
      from: "DR Ravalement <contact@dr-ravalement.fr>",
      to: [args.clientEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    if (data.error) {
      throw new Error(data.error.message || "Erreur lors de l'envoi du mail de confirmation.");
    }

    return { success: true, message: "Email de confirmation envoyé via Resend." };
  } catch (err: any) {
    console.error("Erreur Resend sendClientConfirmationEmail:", err);
    return { success: false, message: "Erreur lors de l'envoi du mail de confirmation client" };
  }
}

// Helper function pour envoyer un email de notification au propriétaire
async function sendOwnerEmail(args: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  date: string;
  time: string;
  duration: number;
  address?: string;
  notes?: string;
  bookingId: string;
}) {
  const emailSubject = `Nouveau rendez-vous réservé - ${args.serviceType}`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2>NOUVELLE réservation reçue</h2>
      <p><b>Un client a pris rendez-vous via le site web.</b></p>
      <ul>
        <li><b>Nom du client :</b> ${args.clientName} </li>
        <li><b>Email du client :</b> ${args.clientEmail} </li>
        <li><b>Téléphone du client :</b> ${args.clientPhone} </li>
        <li><b>Service réservé :</b> ${args.serviceType} </li>
        <li><b>Date :</b> ${args.date} </li>
        <li><b>Heure :</b> ${args.time} </li>
        <li><b>Durée estimée :</b> ${args.duration} minutes</li>
        ${args.address ? `<li><b>Adresse :</b> ${args.address}</li>` : ""}
        ${args.notes ? `<li><b>Notes client :</b> ${args.notes}</li>` : ""}
        <li><b>ID réservation :</b> ${args.bookingId}</li>
      </ul>
      <p>Pensez à consulter la fiche dans l'admin pour confirmer ou reprogrammer le RDV si besoin.</p>
    </div>
  `;

  try {
    const data = await resend.emails.send({
      from: "DR Ravalement <contact@dr-ravalement.fr>",
      to: ["contact@dr-ravalement.fr"],
      subject: emailSubject,
      html: emailHtml,
    });

    if (data.error) {
      throw new Error(data.error.message || "Erreur lors de l'envoi du mail de notification propriétaire.");
    }

    return { success: true, message: "Email de notification envoyé via Resend." };
  } catch (err: any) {
    console.error("Erreur Resend sendOwnerNotificationEmail:", err);
    return { success: false, message: "Erreur lors de l'envoi du mail de notification propriétaire" };
  }
}

// Action pour envoyer un email de confirmation client
export const sendClientConfirmationEmail = action({
  args: {
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.string(),
    serviceType: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    bookingId: v.string(),
  },
  handler: async (_, args) => {
    return await sendClientEmail(args);
  },
});

// Action pour envoyer un email de notification au propriétaire
export const sendOwnerNotificationEmail = action({
  args: {
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.string(),
    serviceType: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    bookingId: v.string(),
  },
  handler: async (_, args) => {
    return await sendOwnerEmail(args);
  },
});

// Action pour envoyer les deux emails (client + propriétaire)
export const sendBookingEmails = action({
  args: {
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.string(),
    serviceType: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    bookingId: v.string(),
  },
  handler: async (_, args) => {
    try {
      // Envoyer les deux emails en parallèle
      await Promise.all([
        sendClientEmail(args),
        sendOwnerEmail(args),
      ]);

      return { success: true, message: "Emails envoyés avec succès" };
    } catch (error) {
      console.error("Erreur lors de l'envoi des emails:", error);
      throw new Error("Erreur lors de l'envoi des emails");
    }
  },
});

// Action pour envoyer un email de confirmation de réservation (après confirmation admin)
export const sendBookingConfirmationEmail = action({
  args: {
    clientName: v.string(),
    clientEmail: v.string(),
    clientPhone: v.string(),
    serviceType: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    bookingId: v.id("bookings"),
    adminNotes: v.optional(v.string()),
  },
  handler: async (_, args) => {
    // Pour l'instant, on simule l'envoi d'email
    console.log("📧 Email de confirmation de réservation:", {
      to: args.clientEmail,
      subject: `✅ Votre réservation est confirmée - ${args.serviceType}`,
      clientName: args.clientName,
      serviceType: args.serviceType,
      date: args.date,
      time: args.time,
      adminNotes: args.adminNotes,
    });

    // TODO: Implémenter l'envoi réel d'email avec Resend
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'DR RAVALEMENT <noreply@dr-ravalement.fr>',
    //   to: [args.clientEmail],
    //   subject: `✅ Votre réservation est confirmée - ${args.serviceType}`,
    //   html: generateBookingConfirmationHTML(args)
    // });

    return { success: true, message: "Email de confirmation envoyé" };
  },
});
