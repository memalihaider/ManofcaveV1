import { getServiceRoleClient } from '@/lib/supabase'

export async function sendAgentMessage(data: {
  agent_id: string
  full_name: string
  email: string
  phone: string
  message: string
}) {
  const supabase = getServiceRoleClient() as any

  const { error } = await supabase
    .from('agent_messages')
    .insert([{
      agent_id: data.agent_id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      status: 'new'
    }])

  if (error) {
    throw new Error(error.message)
  }
}
