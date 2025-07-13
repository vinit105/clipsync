import React, { useEffect, useState } from 'react'
import { FaClipboard, FaPaste } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'
import { createPortal } from 'react-dom'
import { showToast } from './Toast'
import { saveToUserCollection, deleteFromUserCollection } from '../services/authServices'
import { auth, db } from '../firebase/firebase'
import { getDocs, collection, onSnapshot, query, orderBy 
 } from 'firebase/firestore'

const Dashboard = () => {
    const [loading, setLoading] = useState(false)

 useEffect(() => {
  const user = auth.currentUser
  if (!user) return

  const codeQuery = query(
    collection(db, 'users', user.uid, 'code'),
    orderBy('createdAt', 'desc')
  )
  const linkQuery = query(
    collection(db, 'users', user.uid, 'link'),
    orderBy('createdAt', 'desc')
  )
  const textQuery = query(
    collection(db, 'users', user.uid, 'text'),
    orderBy('createdAt', 'desc')
  )

  const unsubCode = onSnapshot(codeQuery, (snapshot) => {
    setCodeSnippets(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
      }))
    )
  })

  const unsubLink = onSnapshot(linkQuery, (snapshot) => {
    setLinks(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
      }))
    )
  })

  const unsubText = onSnapshot(textQuery, (snapshot) => {
    setTexts(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
      }))
    )
  })

  return () => {
    unsubCode()
    unsubLink()
    unsubText()
  }
}, [])


  const [codeSnippets, setCodeSnippets] = useState<{ id: string; content: string }[]>([])
  const [links, setLinks] = useState<{ id: string; content: string }[]>([])
  const [texts, setTexts] = useState<{ id: string; content: string }[]>([])
  const [activeTab, setActiveTab] = useState<'code' | 'link' | 'text'>('text')
  const [modalContent, setModalContent] = useState<string | null>(null)

const handlePaste = async (text: string) => {
    setLoading(true);
    try {
        const user = auth.currentUser
  if (!user || !text.trim()) return

      if (!user) return alert('Not logged in')  

      const isLink = /^https?:\/\//.test(text)
      const isCode = text.trim().startsWith('```') && text.trim().endsWith('```')
      let docId: string | null = null

      if (isCode || activeTab === 'code') {
        const content = isCode ? text : `\`\`\`${text}\`\`\``
        docId = await saveToUserCollection(user.uid, 'code', content)
        if (docId) setCodeSnippets([{ id: docId, content }, ...codeSnippets])
        setActiveTab('code')
      } else if (isLink || activeTab === 'link') {
        docId = await saveToUserCollection(user.uid, 'link', text)
        if (docId) setLinks([{ id: docId, content: text }, ...links])
        setActiveTab('link')
      } else {
        docId = await saveToUserCollection(user.uid, 'text', text)
        if (docId) setTexts([{ id: docId, content: text }, ...texts])
        setActiveTab('text')
      }
      setLoading(false);
    } catch {
      showToast({title:'Clipboard access denied.'})
    }finally{
        setLoading(false);
    }
  }

const fetchUserData = async () => {
  const user = auth.currentUser
  if (!user) return

  setLoading(true)
  try {
    const codeSnap = await getDocs(collection(db, 'users', user.uid, 'code'))
    const linkSnap = await getDocs(collection(db, 'users', user.uid, 'link'))
    const textSnap = await getDocs(collection(db, 'users', user.uid, 'text'))

    setCodeSnippets(codeSnap.docs.map(doc => ({ id: doc.id, content: doc.data().content })))
    setLinks(linkSnap.docs.map(doc => ({ id: doc.id, content: doc.data().content })))
    setTexts(textSnap.docs.map(doc => ({ id: doc.id, content: doc.data().content })))
  } finally {
    setLoading(false)
  }
}


  useEffect(() => {
    fetchUserData()
  }, [])

  const handleDelete = async (id: string, type: 'code' | 'link' | 'text') => {
    
  setLoading(true)
  try{
    const user = auth.currentUser
    if (!user) return

    await deleteFromUserCollection(user.uid, type, id)

    if (type === 'code') setCodeSnippets(prev => prev.filter(item => item.id !== id))
    else if (type === 'link') setLinks(prev => prev.filter(item => item.id !== id))
    else setTexts(prev => prev.filter(item => item.id !== id))

    showToast({ title: 'Deleted!' })
    setLoading(false);
  } catch(err){

  }finally{
    setLoading(false);
  }
  }

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      showToast({ title: 'Copied!' })
    } catch {
      alert('Failed to copy')
    }
  }

  const renderModal = () =>
    modalContent &&
    createPortal(
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={() => setModalContent(null)}>
        <div className="bg-white w-full max-w-md h-[90vh] rounded-3xl shadow-xl p-6 relative flex flex-col" onClick={e => e.stopPropagation()}>
          <button onClick={() => setModalContent(null)} className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl">&times;</button>
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">📄 Full Preview</h3>
          <div className="flex-1 overflow-auto text-sm whitespace-pre-wrap text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{modalContent.replace(/```/g, '')}</div>
          <button onClick={async () => {
            const cleaned = modalContent.replace(/```/g, '')
            await navigator.clipboard.writeText(cleaned)
            showToast({ title: 'Copied' })
            setModalContent(null)
          }} className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">📋 Copy Content</button>
        </div>
      </div>,
      document.body
    )

  const Card = ({ content, rawText, index, onDelete }: { content: React.ReactNode; rawText: string; index: number; onDelete: () => void }) => (
    <div onClick={() => setModalContent(rawText)} className={`relative p-2 rounded-lg border shadow-sm text-sm cursor-pointer hover:shadow-md transition overflow-hidden h-[120px] ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button onClick={e => { e.stopPropagation(); handleCopy(rawText) }} className="text-gray-400 hover:text-black" title="Copy"><FaClipboard /></button>
        <button onClick={e => { e.stopPropagation(); onDelete() }} className="text-gray-400 hover:text-black" title="Delete"><FaDeleteLeft /></button>
      </div>
      <div className="overflow-hidden text-ellipsis">{content}</div>
    </div>
  )

  const renderGrid = (type: 'code' | 'link' | 'text') => {
    const items = type === 'code' ? codeSnippets : type === 'link' ? links : texts

    return (
      <div className="grid grid-flow-col grid-rows-4 gap-2 max-h-[80vh] overflow-x-auto pr-1 p-1" style={{ gridAutoColumns: 250 }}>
        {items.map((item, i) => (
          <Card
            key={item.id}
            index={i}
            rawText={item.content}
            onDelete={() => handleDelete(item.id, type)}
            content={
              type === 'code' ? (
                <pre className="bg-black text-white text-xs p-2 rounded whitespace-pre-wrap overflow-hidden">{item.content.replace(/```/g, '')}</pre>
              ) : type === 'link' ? (
                (() => {
                  try {
                    const safeUrl = encodeURI(item.content)
                    return <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline break-words" onClick={e => e.stopPropagation()}>{item.content}</a>
                  } catch {
                    return <span className="text-red-500 break-words">⚠️ Invalid URL</span>
                  }
                })()
              ) : (
                <p className="text-gray-800 break-words whitespace-pre-wrap">{item.content}</p>
              )
            }
          />
        ))}
      </div>
    )
  }


  return (
    
    <div className="h-[calc(100vh-0px)] w-full flex flex-col overflow-hidden bg-green-100">
      <div className="flex justify-between items-center px-4 py-2 sticky top-0 bg-green-100 z-20">
        <h1 className="text-2xl font-bold">📚 ClipSync Dashboard</h1>
        <button   onClick={async () => {
    try {
      setLoading(true)
      const text = await navigator.clipboard.readText()
      await handlePaste(text) // move your logic to a separate function
    } catch {
      showToast({ title: 'Clipboard access denied.' })
    } finally {
      setLoading(false)
    }
  }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"><FaPaste /> Paste</button>
      </div>
          {loading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-900"></div>
      </div>
    )}
      <div className="flex gap-4 px-4 pb-2 sticky top-[60px] bg-green-100 z-10">
        {['text', 'link', 'code'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
          >
            {tab === 'text' ? '📝 Text' : tab === 'link' ? '🔗 Links' : '💻 Code'}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-4">{renderGrid(activeTab)}</div>
      {renderModal()}
    </div>
  )
}

export default Dashboard
