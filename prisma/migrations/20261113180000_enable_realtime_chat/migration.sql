CREATE OR REPLACE FUNCTION public.is_conversation_realtime_participant(topic text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT pg_catalog.left(topic, 13) = 'conversation:'
    AND EXISTS (
      SELECT 1
      FROM public."Conversation" AS conversation
      WHERE conversation.id = pg_catalog.substr(topic, 14)
        AND (
          conversation."studentId" = auth.uid()
          OR conversation."tutorId" = auth.uid()
        )
    );
$$;

REVOKE ALL ON FUNCTION public.is_conversation_realtime_participant(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_conversation_realtime_participant(text) TO authenticated;

DROP POLICY IF EXISTS "Conversation participants can receive broadcasts" ON realtime.messages;
CREATE POLICY "Conversation participants can receive broadcasts"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  extension = 'broadcast'
  AND public.is_conversation_realtime_participant((SELECT realtime.topic()))
);

DROP POLICY IF EXISTS "Conversation participants can send broadcasts" ON realtime.messages;
CREATE POLICY "Conversation participants can send broadcasts"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  extension = 'broadcast'
  AND public.is_conversation_realtime_participant((SELECT realtime.topic()))
);

CREATE OR REPLACE FUNCTION public.broadcast_conversation_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'conversation:' || NEW."conversationId",
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "Message_broadcast_insert" ON public."Message";
CREATE TRIGGER "Message_broadcast_insert"
AFTER INSERT ON public."Message"
FOR EACH ROW
EXECUTE FUNCTION public.broadcast_conversation_message();
