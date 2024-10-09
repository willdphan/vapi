User Input Section:

A text box for the user to input their query for the voice agent
Above the text box, include a title and an "Expand/Collapse" button to show/hide the enhanced system prompt

Enhanced Prompt Section (initially hidden):

Display the pre-made prompt adapted to the user's query
Allow manual editing of the entire prompt
Implement highlighting and inline editing functionality SIMILAR TO GPT-CANVAS

Backend Integration:

Use Claude 3.5 Sonnet to generate enhanced prompts based on user input
Integrate with Vapi.ai for voice responses

For the pre-made prompt that adapts to user queries, you could structure it like this:

You are a helpful voice assistant named {assistant_name}. Your primary goal is to {primary_goal}.

User Query: {user_query}

Based on the user's query, your response should:

1. Address the specific topic or question raised
2. Provide clear and concise information
3. Use a friendly and engaging tone suitable for voice interaction
4. {additional_instruction_based_on_query}

Remember to speak naturally and use appropriate pauses and intonation in your responses.

Endpoints are listed below:

Create Assistant with Vapi

const options = {
  method: 'POST',
  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
  body: '{"transcriber":{"provider":"deepgram","model":"nova-2","language":"bg","smartFormat":false,"languageDetectionEnabled":false,"keywords":["<string>"],"endpointing":255},"model":{"messages":[{"content":"<string>","role":"assistant"}],"tools":[{"async":false,"messages":[{"type":"request-start","content":"<string>","conditions":[{"value":"<string>","operator":"eq","param":"<string>"}]}],"type":"dtmf","function":{"name":"<string>","description":"<string>","parameters":{"type":"object","properties":{},"required":["<string>"]}},"server":{"timeoutSeconds":20,"url":"<string>","secret":"<string>"}}],"toolIds":["<string>"],"provider":"anyscale","model":"<string>","temperature":1,"knowledgeBase":{"provider":"canonical","topK":5.5,"fileIds":["<string>"]},"maxTokens":525,"emotionRecognitionEnabled":true,"numFastTurns":1},"voice":{"fillerInjectionEnabled":false,"provider":"azure","voiceId":"andrew","speed":1.25,"chunkPlan":{"enabled":true,"minCharacters":30,"punctuationBoundaries":["。","，",".","!","?",";","،","۔","।","॥","|","||",",",":"],"formatPlan":{"enabled":true,"numberToDigitsCutoff":2025,"replacements":[{"type":"exact","key":"<string>","value":"<string>"}]}}},"firstMessageMode":"assistant-speaks-first","hipaaEnabled":false,"clientMessages":["conversation-update","function-call","hang","model-output","speech-update","status-update","transcript","tool-calls","user-interrupted","voice-input"],"serverMessages":["conversation-update","end-of-call-report","function-call","hang","speech-update","status-update","tool-calls","transfer-destination-request","user-interrupted"],"silenceTimeoutSeconds":30,"maxDurationSeconds":600,"backgroundSound":"office","backchannelingEnabled":false,"backgroundDenoisingEnabled":false,"modelOutputInMessagesEnabled":false,"transportConfigurations":[{"provider":"twilio","timeout":60,"record":false,"recordingChannels":"mono"}],"name":"<string>","firstMessage":"<string>","voicemailDetection":{"provider":"twilio","voicemailDetectionTypes":["machine_end_beep","machine_end_silence"],"enabled":true,"machineDetectionTimeout":31,"machineDetectionSpeechThreshold":3500,"machineDetectionSpeechEndThreshold":2750,"machineDetectionSilenceTimeout":6000},"voicemailMessage":"<string>","endCallMessage":"<string>","endCallPhrases":["<string>"],"metadata":{},"serverUrl":"<string>","serverUrlSecret":"<string>","analysisPlan":{"summaryPrompt":"<string>","summaryRequestTimeoutSeconds":10.5,"structuredDataRequestTimeoutSeconds":10.5,"successEvaluationPrompt":"<string>","successEvaluationRubric":"NumericScale","successEvaluationRequestTimeoutSeconds":10.5,"structuredDataPrompt":"<string>","structuredDataSchema":{"type":"string","items":{},"properties":{},"description":"<string>","required":["<string>"]}},"artifactPlan":{"recordingEnabled":true,"videoRecordingEnabled":false,"recordingPath":"<string>"},"messagePlan":{"idleMessages":["<string>"],"idleMessageMaxSpokenCount":5.5,"idleTimeoutSeconds":17.5},"startSpeakingPlan":{"waitSeconds":0.4,"smartEndpointingEnabled":false,"transcriptionEndpointingPlan":{"onPunctuationSeconds":0.1,"onNoPunctuationSeconds":1.5,"onNumberSeconds":0.5}},"stopSpeakingPlan":{"numWords":0,"voiceSeconds":0.2,"backoffSeconds":1},"monitorPlan":{"listenEnabled":false,"controlEnabled":false},"credentialIds":["<string>"]}'
};

fetch('https://api.vapi.ai/assistant', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

Get Assistant with Vapi:

const options = {method: 'GET', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.vapi.ai/assistant/{id}', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));


Update Assistants with Vapi:

const options = {
  method: 'PATCH',
  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
  body: '{"transcriber":{"provider":"deepgram","model":"nova-2","language":"bg","smartFormat":false,"languageDetectionEnabled":false,"keywords":["<string>"],"endpointing":255},"model":{"messages":[{"content":"<string>","role":"assistant"}],"tools":[{"async":false,"messages":[{"type":"request-start","content":"<string>","conditions":[{"value":"<string>","operator":"eq","param":"<string>"}]}],"type":"dtmf","function":{"name":"<string>","description":"<string>","parameters":{"type":"object","properties":{},"required":["<string>"]}},"server":{"timeoutSeconds":20,"url":"<string>","secret":"<string>"}}],"toolIds":["<string>"],"provider":"anyscale","model":"<string>","temperature":1,"knowledgeBase":{"provider":"canonical","topK":5.5,"fileIds":["<string>"]},"maxTokens":525,"emotionRecognitionEnabled":true,"numFastTurns":1},"voice":{"fillerInjectionEnabled":false,"provider":"azure","voiceId":"andrew","speed":1.25,"chunkPlan":{"enabled":true,"minCharacters":30,"punctuationBoundaries":["。","，",".","!","?",";","،","۔","।","॥","|","||",",",":"],"formatPlan":{"enabled":true,"numberToDigitsCutoff":2025,"replacements":[{"type":"exact","key":"<string>","value":"<string>"}]}}},"firstMessageMode":"assistant-speaks-first","hipaaEnabled":false,"clientMessages":["conversation-update","function-call","hang","model-output","speech-update","status-update","transcript","tool-calls","user-interrupted","voice-input"],"serverMessages":["conversation-update","end-of-call-report","function-call","hang","speech-update","status-update","tool-calls","transfer-destination-request","user-interrupted"],"silenceTimeoutSeconds":30,"maxDurationSeconds":600,"backgroundSound":"office","backchannelingEnabled":false,"backgroundDenoisingEnabled":false,"modelOutputInMessagesEnabled":false,"transportConfigurations":[{"provider":"twilio","timeout":60,"record":false,"recordingChannels":"mono"}],"name":"<string>","firstMessage":"<string>","voicemailDetection":{"provider":"twilio","voicemailDetectionTypes":["machine_end_beep","machine_end_silence"],"enabled":true,"machineDetectionTimeout":31,"machineDetectionSpeechThreshold":3500,"machineDetectionSpeechEndThreshold":2750,"machineDetectionSilenceTimeout":6000},"voicemailMessage":"<string>","endCallMessage":"<string>","endCallPhrases":["<string>"],"metadata":{},"serverUrl":"<string>","serverUrlSecret":"<string>","analysisPlan":{"summaryPrompt":"<string>","summaryRequestTimeoutSeconds":10.5,"structuredDataRequestTimeoutSeconds":10.5,"successEvaluationPrompt":"<string>","successEvaluationRubric":"NumericScale","successEvaluationRequestTimeoutSeconds":10.5,"structuredDataPrompt":"<string>","structuredDataSchema":{"type":"string","items":{},"properties":{},"description":"<string>","required":["<string>"]}},"artifactPlan":{"recordingEnabled":true,"videoRecordingEnabled":false,"recordingPath":"<string>"},"messagePlan":{"idleMessages":["<string>"],"idleMessageMaxSpokenCount":5.5,"idleTimeoutSeconds":17.5},"startSpeakingPlan":{"waitSeconds":0.4,"smartEndpointingEnabled":false,"transcriptionEndpointingPlan":{"onPunctuationSeconds":0.1,"onNoPunctuationSeconds":1.5,"onNumberSeconds":0.5}},"stopSpeakingPlan":{"numWords":0,"voiceSeconds":0.2,"backoffSeconds":1},"monitorPlan":{"listenEnabled":false,"controlEnabled":false},"credentialIds":["<string>"]}'
};

fetch('https://api.vapi.ai/assistant/{id}', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

Delete Assistant with Vapi:

const options = {method: 'DELETE', headers: {Authorization: 'Bearer <token>'}};

fetch('https://api.vapi.ai/assistant/{id}', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
