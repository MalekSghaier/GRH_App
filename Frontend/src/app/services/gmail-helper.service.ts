import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GmailHelperService {

  constructor() { }

  openGmailDraft(emailData: { to: string; subject: string; body: string }): void {
    const gmailUrl = `https://mail.google.com/mail/?view=cm` +
      `&to=${encodeURIComponent(emailData.to)}` +
      `&su=${encodeURIComponent(emailData.subject)}` +
      `&body=${encodeURIComponent(emailData.body)}` +
      `&fs=1&tf=1&authuser=0`;
      
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  }
}
