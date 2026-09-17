import React, { useState } from 'react';
import { Phone, MessageSquare, Smartphone, ShieldCheck, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface ChannelSimulatorProps {
  currentNation: string;
}

export const ChannelSimulator: React.FC<ChannelSimulatorProps> = ({ currentNation }) => {
  const [activeChannel, setActiveChannel] = useState<'ivr' | 'whatsapp' | 'sms'>('ivr');
  const [callerNumber, setCallerNumber] = useState<string>('+919876543210');
  const [callerName, setCallerName] = useState<string>('Vikram Singh');
  const [messageText, setMessageText] = useState<string>(
    'Mera naam Vikram Singh hai, phone 9876543210. Chhatarpur gram me paani ki pipe phoot gayi hai, 4 din se peene ka paani band hai.'
  );
  const [signature, setSignature] = useState<string>('valid_carrier_sig_2026');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [responseLog, setResponseLog] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const channelConfigs = {
    ivr: {
      name: 'Interactive Voice Response (IVR)',
      icon: <Phone size={18} />,
      desc: 'Simulates inbound toll-free phone call from basic 2G feature phone with server-side ASR transcription.',
      defaultMsg: 'Hello, this is Vikram Singh calling from Bundelkhand. Our village drinking water pipeline has ruptured and we have no clean water for 4 days.',
    },
    whatsapp: {
      name: 'WhatsApp Business API Webhook',
      icon: <MessageSquare size={18} />,
      desc: 'Simulates Cloud API inbound message webhook with cryptographic carrier signature verification.',
      defaultMsg: 'Hi Setu, road in Ward 9 has severe 3-foot deep pothole causing vehicle accidents near primary school. Please fix!',
    },
    sms: {
      name: 'SMS Aggregator Gateway',
      icon: <Smartphone size={18} />,
      desc: 'Simulates shortcode SMS relay for low-connectivity offline citizens.',
      defaultMsg: 'Drainage overflow emergency near main market ward 14. Filthy water entering shops.',
    },
  };

  const handleChannelSwitch = (channel: 'ivr' | 'whatsapp' | 'sms') => {
    setActiveChannel(channel);
    setMessageText(channelConfigs[channel].defaultMsg);
    setResponseLog(null);
  };

  const handleSendWebhook = async () => {
    setIsSending(true);
    setError(null);
    setResponseLog(null);

    const payload = {
      nation_id: currentNation,
      channel: activeChannel,
      lang: 'en',
      text: `${messageText} (Reported by ${callerName}, phone: ${callerNumber})`,
      consent_flag: true,
      sender_id: callerNumber,
      geo: {
        lat: currentNation === 'IND' ? 24.914 : currentNation === 'BRA' ? -22.862 : -26.248,
        lng: currentNation === 'IND' ? 79.584 : currentNation === 'BRA' ? -43.243 : 27.854,
        landmark: 'Simulated Inbound Gateway Node',
      },
    };

    try {
      const res = await fetch('/api/webhooks/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeChannel === 'ivr' ? 'Asterisk/Twilio Voice' : activeChannel === 'whatsapp' ? 'Meta Cloud API' : 'SMS Aggregator',
          signature,
          payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Webhook verification failed');
      }

      setResponseLog(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', fontWeight: 700, fontSize: 'var(--text-xs)' }}>
          <ShieldCheck size={16} />
          <span>GATEWAY INTEGRATION TESTBENCH</span>
        </div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
          Multi-Channel Citizen Ingestion Simulator
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
          Test inbound IVR phone calls, WhatsApp webhooks, and SMS ingestion payloads. Observe instant PII redaction, translation, and clustering.
        </p>
      </div>

      {/* Channel Switcher Tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {(['ivr', 'whatsapp', 'sms'] as const).map((ch) => {
          const config = channelConfigs[ch];
          const isSelected = activeChannel === ch;
          return (
            <button
              key={ch}
              onClick={() => handleChannelSwitch(ch)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid',
                borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-subtle)',
                backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
              }}
            >
              {config.icon}
              <span>{config.name}</span>
            </button>
          );
        })}
      </div>

      {/* Simulator Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
        {/* Left: Input Payload Configuration */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>
            Simulate Inbound Event ({channelConfigs[activeChannel].name})
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            {channelConfigs[activeChannel].desc}
          </p>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 4 }}>
              Inbound Caller / Sender Phone
            </label>
            <input
              type="text"
              value={callerNumber}
              onChange={(e) => setCallerNumber(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 4 }}>
              Citizen Self-Introduction (will be PII-redacted)
            </label>
            <input
              type="text"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 4 }}>
              Message / Voice Audio Content
            </label>
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                lineHeight: 1.5,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: 4 }}>
              Carrier Webhook Signature (Security Gate)
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'monospace',
              }}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Set to anything other than "valid_carrier_sig_2026" to test 401 signature rejection.
            </span>
          </div>

          <button
            onClick={handleSendWebhook}
            disabled={isSending}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              cursor: isSending ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {isSending ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
            <span>Dispatch Webhook Ingestion Event</span>
          </button>
        </div>

        {/* Right: Real-time Ingestion & Redaction Pipeline Output */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>
            Pipeline Execution & Telemetry Output
          </h3>

          {error && (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-critical-light)',
              color: 'var(--color-critical)',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {responseLog ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-success-light)',
                border: '1px solid var(--color-success-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 'var(--text-xs)',
                color: 'var(--color-success)',
                fontWeight: 700,
              }}>
                <CheckCircle2 size={18} />
                <span>Ingestion Successful: Status {responseLog.status.toUpperCase()}</span>
              </div>

              {/* PII Redaction Telemetry */}
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                fontSize: 'var(--text-xs)',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  🔒 PII Redaction Audit (Rules.md §2):
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  PII Detected & Stripped: <strong>{responseLog.pii_redacted ? 'YES (Phone/Name Tokenized)' : 'NO'}</strong>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                  Clean Text Entering Bus:
                  <div style={{
                    marginTop: 4,
                    padding: '8px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: 'var(--color-primary)'
                  }}>
                    {responseLog.redacted_text}
                  </div>
                </div>
              </div>

              {/* Clustered Demand Signal */}
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                fontSize: 'var(--text-xs)',
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  📍 Deduplication & Demand Clustering:
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  Cluster ID: <strong>{responseLog.demand_signal_id}</strong>
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                  Sector Classified: <strong>{responseLog.category.toUpperCase()}</strong> (Urgency {responseLog.urgency_score}/10)
                </div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                  Assigned Tracking ID: <strong style={{ color: 'var(--color-primary)' }}>{responseLog.tracking_id}</strong>
                </div>
              </div>

              {/* Raw JSON */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                  RAW JSON RESPONSE
                </div>
                <pre style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  maxHeight: 180,
                  overflowY: 'auto',
                }}>
                  {JSON.stringify(responseLog, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              padding: '40px 20px',
              textAlign: 'center',
            }}>
              <ShieldCheck size={36} style={{ marginBottom: 10, opacity: 0.4 }} />
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Ready to ingest</div>
              <div style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>
                Configure payload and click "Dispatch Webhook Ingestion Event" to observe pipeline execution.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
