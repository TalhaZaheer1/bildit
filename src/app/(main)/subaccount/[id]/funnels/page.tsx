import { getFunnels } from '@/lib/queries'
import React from 'react'
import FunnelsDataTable from './data-table'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import FunnelForm from '@/components/forms/FunnelForm'

const Funnels = async ({ params }: { params: { id: string } }) => {
  const funnels = await getFunnels(params.id)
  if (!funnels) return null

  return (
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm  subAccountId={params.id}></FunnelForm>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
  )
}

export default Funnels