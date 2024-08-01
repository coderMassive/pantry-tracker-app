'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

import Webcam from "react-webcam";

//import { OpenAI } from 'openai';

//const openai = new OpenAI();

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [openCam, setOpenCam] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState('1')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const completelyRemoveItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await deleteDoc(docRef)
    }
    await updateInventory()
  }

  const addWithQuantity = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    await setDoc(docRef, { quantity: quantity })
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleOpenCam = () => setOpenCam(true)
  const handleCloseCam = () => setOpenCam(false)

  const webcamRef = useRef(null);
  const [img, setImg] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
    // const base64img = fs.readFileSync(img, {encoding: "base64"})
    // const name = openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //       {
    //           role: "user",
    //           content: [
    //               {
    //                   type: "text",
    //                   text: "Output the name of the food item shown as one word in plural form."
    //               },
    //               {
    //                   type: "image_url",
    //                   image_url: {
    //                       url: `data:image/jpg;base64,${base64img}`,
    //                       detail: "low"
    //                   }
    //               }
    //           ]
    //       }
    //   ]
    // }).choices[0].messgae.content;
    // addWithQuantity(name, parseInt(itemQuantity))
    // setItemName('')
    // setItemQuantity('1')
    // handleCloseCam()
  }, [webcamRef]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      bgcolor={'#F0F8FF'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" color={'#333'} variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addWithQuantity(itemName, parseInt(itemQuantity))
                setItemName('')
                setItemQuantity('1')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Modal
        open={openCam}
        onClose={handleCloseCam}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" color={'#333'} variant="h6" component="h2">
            Add Item With Webcam
          </Typography>
          <Stack width="100%" direction={'column'} spacing={2}>
            <Webcam width="100%" screenshotFormat='image/jpg' mirrored='true' ref={webcamRef}/>
            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                capture()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpenCam}>
        Add With Camera
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              display={'flex'}
              justifyContent={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={1}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <div style={{display:'flex', marginLeft:'auto'}}>
                <Button
                        style={{
                          alignItems:'center',
                          justifyContent:'center',
                          height:60,
                          borderRadius:100
                        }}
                        onClick={() => removeItem(name)}>
                  <p style={{fontSize:'150%'}}>-</p>
                </Button>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {quantity}
                </Typography>
                <Button
                        style={{
                          alignItems:'center',
                          justifyContent:'center',
                          height:60,
                          borderRadius:100
                        }}
                        onClick={() => addItem(name)}>
                  <p style={{fontSize:'150%'}}>+</p>
                </Button>
                <Button variant="contained" style={{marginLeft:20}} onClick={() => completelyRemoveItem(name)}>
                  Remove
                </Button>
              </div>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}