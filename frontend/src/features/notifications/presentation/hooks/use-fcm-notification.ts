import { useMe } from "@/features/auth/presentation/hooks/use-auth-hooks";
import { getFirebaseMessaging } from "@/lib/firebase";
import { queryKeys } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { notificationApi } from "../../api/notification.api";

export const useFcmNotification = () => {
  const { data: user } = useMe();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isTokenSynced, setIsTokenSynced] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPermission(Notification.permission);
      const isSynced = localStorage.getItem("fcm_token_synced") === "true";
      setIsTokenSynced(isSynced);
    }
  }, []);

  const registerToken = async () => {
    if (typeof window === "undefined" || !user) return;
    setLoading(true);
    try {
      // 1. Request permission
      if (Notification.permission === "denied") {
        throw new Error("Quyền nhận thông báo đang bị chặn. Vui lòng cho phép nhận thông báo trong cài đặt trình duyệt (ở góc thanh địa chỉ) để tiếp tục.");
      }
      const reqPermission = await Notification.requestPermission();
      setPermission(reqPermission);
      if (reqPermission !== "granted") {
        throw new Error("Quyền nhận thông báo chưa được cấp.");
      }

      // 2. Fetch Messaging instance
      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        throw new Error("FCM Messaging is not supported or failed to initialize.");
      }

      // 3. Construct service worker URL with config parameters
      const apiKey = encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "");
      const authDomain = encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "");
      const projectId = encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "");
      const storageBucket = encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "");
      const messagingSenderId = encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "");
      const appId = encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "");

      const swUrl = `/firebase-messaging-sw.js?apiKey=${apiKey}&authDomain=${authDomain}&projectId=${projectId}&storageBucket=${storageBucket}&messagingSenderId=${messagingSenderId}&appId=${appId}`;

      // 4. Register service worker
      const registration = await navigator.serviceWorker.register(swUrl);
      
      // Wait for the service worker to become active to avoid "no active Service Worker" subscription error
      await new Promise<void>((resolve) => {
        if (registration.active) {
          resolve();
          return;
        }
        
        const worker = registration.installing || registration.waiting;
        if (worker) {
          const stateListener = () => {
            if (worker.state === "activated") {
              worker.removeEventListener("statechange", stateListener);
              resolve();
            }
          };
          worker.addEventListener("statechange", stateListener);
        } else {
          navigator.serviceWorker.ready.then(() => resolve());
        }
      });
      
      // 5. Retrieve registration token
      const { getToken } = await import("firebase/messaging");
      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!fcmToken) {
        throw new Error("No FCM token returned from Firebase Client SDK.");
      }

      // 6. Sync token with backend
      await notificationApi.registerFcmToken({
        fcmToken,
        platform: "WEB",
      });

      localStorage.setItem("fcm_token", fcmToken);
      localStorage.setItem("fcm_token_synced", "true");
      setIsTokenSynced(true);
      toast.success("Push notifications enabled successfully!");
    } catch (error: any) {
      console.error("Failed to enable push notifications:", error);
      toast.error(error.message || "Could not enable push notifications.");
    } finally {
      setLoading(false);
    }
  };

  const unregisterToken = async () => {
    if (typeof window === "undefined") return;
    setLoading(true);
    try {
      const fcmToken = localStorage.getItem("fcm_token");
      if (fcmToken) {
        // Call backend API to deactivate
        await notificationApi.unregisterFcmToken(fcmToken);
      }

      localStorage.removeItem("fcm_token");
      localStorage.setItem("fcm_token_synced", "false");
      setIsTokenSynced(false);
      toast.success("Push notifications disabled.");
    } catch (error: any) {
      console.error("Failed to disable push notifications:", error);
      toast.error("Could not disable push notifications.");
    } finally {
      setLoading(false);
    }
  };

  // Listen for foreground messages
  useEffect(() => {
    if (typeof window === "undefined" || !user) return;
    let unsubscribe: (() => void) | undefined;

    const setupForegroundListener = async () => {
      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        const { onMessage } = await import("firebase/messaging");
        unsubscribe = onMessage(messaging, (payload) => {
          console.log("[FCM Foreground] Message received:", payload);
          
          // Invalidate cache immediately to refetch counts/lists
          queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });

          const title = payload.notification?.title || payload.data?.title || "Notification";
          const body = payload.notification?.body || payload.data?.body || "";
          const actionUrl = payload.data?.actionUrl || payload.data?.targetUrl;

          // Push toast notification on screen
          toast(title, {
            description: body,
            action: actionUrl
              ? {
                  label: "View",
                  onClick: () => {
                    router.push(actionUrl);
                  },
                }
              : undefined,
          });
        });
      } catch (err) {
        console.error("Failed to setup foreground messaging listener:", err);
      }
    };

    setupForegroundListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, queryClient, router]);

  return {
    permission,
    isTokenSynced,
    registerToken,
    unregisterToken,
    loading,
  };
};
