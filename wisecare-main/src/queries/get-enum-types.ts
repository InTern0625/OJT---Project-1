import { createBrowserClient } from '@/utils/supabase-client'

const getEnumOptions = async (enumName: string): Promise<string[]> => {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.rpc('get_enum_values', {
        enum_name: enumName,
    })

    if (error) throw error
    return data ?? []
}

export default getEnumOptions

