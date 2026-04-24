import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, workEmail, phoneNumber, industry, estimatedMonthlyBookings } = body;

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'SKADI <noreply@theskadi.com>',
      to: 'connect@geekonomy.in',
      subject: 'New Booking Request - SKADI Demo',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f0; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .header { background: linear-gradient(135deg, #1a3a2f 0%, #2d5a4a 100%); color: #f5f1e8; padding: 32px 24px; text-align: center; }
              .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
              .header p { font-size: 14px; opacity: 0.9; }
              .content { padding: 32px 24px; }
              .section { margin-bottom: 24px; }
              .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #666; margin-bottom: 8px; font-weight: 600; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
              .info-item { background: #f8f8f3; padding: 16px; border-radius: 8px; border-left: 3px solid #1a3a2f; }
              .info-label { font-size: 12px; color: #666; margin-bottom: 4px; font-weight: 500; }
              .info-value { font-size: 16px; color: #1a1a1a; font-weight: 600; }
              .full-width { grid-column: 1 / -1; }
              .cta-section { background: #f8f8f3; padding: 20px; border-radius: 8px; text-align: center; margin-top: 24px; }
              .cta-text { font-size: 14px; color: #555; margin-bottom: 12px; }
              .footer { text-align: center; padding: 20px; background: #f8f8f3; font-size: 12px; color: #888; }
              .badge { display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚀 New Booking Request</h1>
                <p>SKADI Demo Inquiry</p>
              </div>
              <div class="content">
                <div class="section">
                  <p style="font-size: 15px; color: #444; margin-bottom: 20px;">
                    A new demo booking request has been received. Here are the lead details:
                  </p>
                </div>

                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Full Name</div>
                    <div class="info-value">${fullName}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Industry</div>
                    <div class="info-value">${industry}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${workEmail}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Phone</div>
                    <div class="info-value">${phoneNumber}</div>
                  </div>
                  <div class="info-item full-width">
                    <div class="info-label">Estimated Monthly Bookings</div>
                    <div class="info-value">${estimatedMonthlyBookings}</div>
                  </div>
                </div>

                <div class="cta-section">
                  <p class="cta-text">Please contact this lead within 24 hours to schedule their demo.</p>
                </div>
              </div>
              <div class="footer">
                <p>Powered by SKADI • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
