"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { EntityChangeEvent } from "@/src/types/custom.types";

export async function getRecentEntityChangeEvents(limit: number = 10): Promise<EntityChangeEvent[]> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data, error } = await supabase
    .from('entity_changes_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent entity change events:', error);
    return [];
  }

  return data as EntityChangeEvent[];
}
