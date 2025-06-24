import { shallowMount } from '@vue/test-utils'
import JoinRoom from '@/components/JoinRoom.vue'
import axios from 'axios'

// Mock axios
jest.mock('axios', () => ({
    get: jest.fn()
}))

function flushPromises() {
    return new Promise(resolve => setTimeout(resolve))
}

describe('JoinRoom.vue', () => {
    it('Simulate a 4 players room and the players join', async () => {
        const roomId = 'room123'
        const roomDetails = {
            score: 20,
            users: [],
            roomId,
            full: false
        }

        let joinCount = 0
        axios.get.mockImplementation((url) => {
            if (url.includes('/room-exists/')) {
                return Promise.resolve({ data: { exists: true, full: joinCount >= 4 } })
            }
            return Promise.resolve({ data: { exists: false } })
        })

        const wrapper = shallowMount(JoinRoom)

        for (let i = 1; i <= 4; i++) {
            wrapper.setData({ joinRoomId: roomId })
            joinCount = i - 1
            await wrapper.vm.joinRoom()
            const username = `player${i}`
            roomDetails.users.push(username)
            wrapper.vm.handleUserJoined({
                username,
                roomDetails: { ...roomDetails },
                score: roomDetails.score,
                users: [...roomDetails.users]
            })

            expect(wrapper.vm.isConnected).toBe(true)
            expect(wrapper.vm.username).toBe(username)
            expect(wrapper.vm.roomDetails.users.length).toBe(i)
        }

        // After 4 players, the room should be full
        joinCount = 4
        wrapper.setData({ joinRoomId: roomId })
        window.alert = jest.fn()
        await wrapper.vm.joinRoom()
        await flushPromises()

        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Room is full'))
    })
})
