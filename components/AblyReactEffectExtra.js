import Ably from "ably/promises";
import { useEffect } from 'react'

const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });
const userid = "" + Math.floor(Math.random()*(999-100+1)+100) + ""  + Math.floor(Math.random()*(999-100+1)+100);
export function useChatChannels(channelName, callbackOnMessage) {
    const channel_in = ably.channels.get("inbound_chat:" + channelName + userid);
    const channel_out = ably.channels.get("outbound_chat:" + channelName);

    const onMount = () => {
        channel_out.subscribe(msg => { callbackOnMessage(msg); });
    }

    const onUnmount = () => {
        channel_out.unsubscribe();
    }

    const useEffectHook = () => {
        onMount();
        return () => { onUnmount(); };
    };

    useEffect(useEffectHook);

    return [channel_in, channel_out, ably, userid];
}