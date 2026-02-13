

// "use client"

// import React, { useState } from "react"
// import {
//   DndContext,
//   closestCenter,
// } from "@dnd-kit/core"
// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
//   useSortable,
// } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"

// function SortableItem({ id }: { id: string }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id })

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   }

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className="flex items-center justify-between p-3 border rounded mb-2 bg-white"
//     >
//       <span>Category {id}</span>

//       {/* 🔥 Drag Handle */}
//       <button
//         {...attributes}
//         {...listeners}
//         className="cursor-grab px-2"
//       >
//         ⠿
//       </button>
//     </div>
//   )
// }

// export default function CategoryViewPage() {
//   const [items, setItems] = useState(["1", "2", "3", "4"])

//   return (
//     <div className="p-10 max-w-md mx-auto">
//       <DndContext
//         collisionDetection={closestCenter}
//         onDragEnd={(event) => {
//           const { active, over } = event

//           if (over && active.id !== over.id) {
//             setItems((items) => {
//               const oldIndex = items.indexOf(active.id as string)
//               const newIndex = items.indexOf(over.id as string)
//               return arrayMove(items, oldIndex, newIndex)
//             })
//           }
//         }}
//       >
//         <SortableContext
//           items={items}
//           strategy={verticalListSortingStrategy}
//         >
//           {items.map((id) => (
//             <SortableItem key={id} id={id} />
//           ))}
//         </SortableContext>
//       </DndContext>
//     </div>
//   )
// }
