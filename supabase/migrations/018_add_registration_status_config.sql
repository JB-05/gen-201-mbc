-- Add registration status configuration to control registration availability
INSERT INTO configuration (key, value, description) VALUES
    ('registration_open', 'false', 'Whether registration is currently open (true/false)'),
    ('event_status', 'completed', 'Current event status (upcoming, ongoing, completed)')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = TIMEZONE('utc'::text, NOW());
