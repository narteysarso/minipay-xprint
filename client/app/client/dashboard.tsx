'use client';

import { useEffect, useState } from "react";
import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { UserNav } from "./components/user-nav"
import { taskSchema } from "../../data/schema"
import { PrintProvider, usePrint } from "@/hooks/print-data-hook"
import tasksData from "../../data/tasks.json";



export default function Dashboard() {
    const [tasks, setTasks] = useState(z.array(taskSchema).parse(tasksData));
    const { prints } = usePrint();
    return (
        <>
            <div className="h-full flex-1 flex-col p-2 md:flex">
                <div className="flex items-center justify-between space-y-2 mb-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                        <p className="text-muted-foreground w-[40vw]">
                            Your print list
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UserNav />
                    </div>
                </div>
                <DataTable data={prints || []} columns={columns} />
            </div>
        </>
    )
}