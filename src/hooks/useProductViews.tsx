import { supabase } from "@/integrations/supabase/client";

// Generate or get session ID for anonymous tracking
const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export const useProductViews = () => {
  const trackProductView = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const sessionId = getSessionId();
      
      await supabase
        .from('product_views')
        .insert({
          product_id: productId,
          user_id: user?.id || null,
          session_id: sessionId,
          ip_address: null // Could be populated from server side if needed
        });
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  return { trackProductView };
};