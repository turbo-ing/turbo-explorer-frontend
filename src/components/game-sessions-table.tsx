// For Removal
// import Link from 'next/link'
// import { Eye, ChevronLeft, ChevronRight } from 'lucide-react'
// import { Session } from './turbo-explorer'

// interface GameSessionsTableProps {
//   allSessions: Session[]
//   sessions: Session[]
//   currentPage: number
//   totalPages: number
//   onPageChange: (page: number) => void
// }

// function formatShortDate(date: Date): string {
//   // Ensure date is a valid Date object
//   const validDate = typeof date === 'string' ? new Date(date) : date;

//   if (!(validDate instanceof Date) || isNaN(validDate.getTime())) {
//     throw new Error("Invalid date provided");
//   }

//   const userLocale = navigator.language || 'en-US'; 
//   const month = validDate.toLocaleString(userLocale, { month: 'short' });
//   const day = validDate.getDate().toString().padStart(2, '0');
//   const year = validDate.getFullYear();
//   const hours = validDate.getHours().toString().padStart(2, '0');
//   const minutes = validDate.getMinutes().toString().padStart(2, '0');

//   return `${day} ${month} ${year}, ${hours}:${minutes}`;
// }

// export default function GameSessionsTable({ sessions, currentPage, totalPages, onPageChange }: GameSessionsTableProps) {

//   return (
//     <div className="bg-white shadow-md rounded-lg overflow-hidden">
//       <table className="min-w-full divide-y divide-stone-200">
//         <thead className="bg-stone-50">
//           <tr>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
//               ID
//             </th>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
//               Topic ID
//             </th>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
//               Timestamp
//             </th>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
//               Interactions
//             </th>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-stone-200">
//           {sessions.map((session) => (
//             <tr key={session.id}>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">{session.id}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{session.topic}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{formatShortDate(session.created_at)}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">{session.interaction_count}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                 <Link href={`/session/${session.id}`} className="text-indigo-600 hover:text-indigo-900 flex justify-center">
//                   <Eye className="w-5 h-5" />
//                 </Link>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-stone-200 sm:px-6">
//         <div className="flex-1 flex justify-between sm:hidden">
//           <button
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="relative inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50"
//           >
//             Previous
//           </button>
//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="ml-3 relative inline-flex items-center px-4 py-2 border border-stone-300 text-sm font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50"
//           >
//             Next
//           </button>
//         </div>
//         <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//           <div>
//             <p className="text-sm text-stone-700">
//               Showing <span className="font-medium">{(currentPage - 1) * 5 + 1}</span> to <span className="font-medium">{Math.min(currentPage * 5, sessions.length)}</span> of{' '}
//               <span className="font-medium">{sessions.length}</span> results
//             </p>
//           </div>
//           <div>
//             <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//               <button
//                 onClick={() => onPageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-stone-300 bg-white text-sm font-medium text-stone-500 hover:bg-stone-50"
//               >
//                 <span className="sr-only">Previous</span>
//                 <ChevronLeft className="h-5 w-5" aria-hidden="true" />
//               </button>
//               { /* TODO: stop this element array overflowing by tweaking the function */ [...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => onPageChange(i + 1)}
//                   className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                     currentPage === i + 1
//                       ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
//                       : 'bg-white border-stone-300 text-stone-500 hover:bg-stone-50'
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={() => onPageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-stone-300 bg-white text-sm font-medium text-stone-500 hover:bg-stone-50"
//               >
//                 <span className="sr-only">Next</span>
//                 <ChevronRight className="h-5 w-5" aria-hidden="true" />
//               </button>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

