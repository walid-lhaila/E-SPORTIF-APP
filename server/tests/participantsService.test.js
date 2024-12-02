import ParticipantsService from '../services/participantsService';
import eventDb from '../models/eventModel';
jest.mock('../models/eventModel');

describe('ParticipantsService', () => {
  let eventId;
  let participants;
  let participantsToDelete;

  beforeEach(() => {
    eventId = 'event123';
    participants = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Doe', email: 'jane@example.com' }
    ];
    participantsToDelete = ['participant123', 'participant456'];  // IDs of participants to delete
  });

  // Test for addParticipants
  describe('addParticipants', () => {
    it('should add participants to an event', async () => {
      const mockEvent = { participants: [] };
      const updateEventMock = jest.fn().mockResolvedValue({
        ...mockEvent,
        participants: [...mockEvent.participants, ...participants]
      });
      eventDb.findById.mockResolvedValue(mockEvent);
      eventDb.findByIdAndUpdate.mockImplementation(updateEventMock);

      const result = await ParticipantsService.addParticipants(eventId, participants);

      expect(eventDb.findById).toHaveBeenCalledWith(eventId);
      expect(eventDb.findByIdAndUpdate).toHaveBeenCalledWith(
        eventId,
        { $push: { participants: { $each: participants } } },
        { new: true }
      );
      expect(result.participants.length).toBe(2);
      expect(result.participants[0].name).toBe('John Doe');
      expect(result.participants[1].name).toBe('Jane Doe');
    });

    it('should throw an error if the event is not found', async () => {
      eventDb.findById.mockResolvedValue(null);

      await expect(ParticipantsService.addParticipants(eventId, participants))
        .rejects
        .toThrow('Event Not Found');
    });

    it('should throw an error if an error occurs during the operation', async () => {
      eventDb.findById.mockRejectedValue(new Error('Database error'));

      await expect(ParticipantsService.addParticipants(eventId, participants))
        .rejects
        .toThrow('Database error');
    });
  });

  // Test for getAllParticipants
  describe('getAllParticipants', () => {
    it('should return all participants for the event', async () => {
      const mockEvent = {
        participants: [
          { name: 'John Doe', email: 'john@example.com' },
          { name: 'Jane Doe', email: 'jane@example.com' }
        ]
      };
      eventDb.findById.mockResolvedValue(mockEvent);

      const result = await ParticipantsService.getAllParticipants(eventId);

      expect(eventDb.findById).toHaveBeenCalledWith(eventId, 'participants');
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('John Doe');
      expect(result[1].name).toBe('Jane Doe');
    });

    it('should throw an error if the event is not found', async () => {
      eventDb.findById.mockResolvedValue(null);

      await expect(ParticipantsService.getAllParticipants(eventId))
        .rejects
        .toThrow('Event Not Found');
    });

    it('should throw an error if an error occurs during the operation', async () => {
      eventDb.findById.mockRejectedValue(new Error('Database error'));

      await expect(ParticipantsService.getAllParticipants(eventId))
        .rejects
        .toThrow('Database error');
    });
  });

  // Test for deleteParticipants
  describe('deleteParticipants', () => {
    it('should delete participants from the event', async () => {
      const mockEvent = {
        participants: [
          { _id: 'participant123', name: 'John Doe', email: 'john@example.com' },
          { _id: 'participant456', name: 'Jane Doe', email: 'jane@example.com' }
        ]
      };
      const updateEventMock = jest.fn().mockResolvedValue({
        ...mockEvent,
        participants: mockEvent.participants.filter(
          participant => !participantsToDelete.includes(participant._id)
        )
      });
      eventDb.findById.mockResolvedValue(mockEvent);
      eventDb.findByIdAndUpdate.mockImplementation(updateEventMock);

      const result = await ParticipantsService.deleteParticipants(eventId, participantsToDelete);

      expect(eventDb.findById).toHaveBeenCalledWith(eventId);
      expect(eventDb.findByIdAndUpdate).toHaveBeenCalledWith(
        eventId,
        { $pull: { participants: { _id: { $in: participantsToDelete } } } },
        { new: true }
      );
      expect(result.participants.length).toBe(0);  // Check that participants have been deleted
    });

    it('should throw an error if the event is not found', async () => {
      eventDb.findById.mockResolvedValue(null);

      await expect(ParticipantsService.deleteParticipants(eventId, participantsToDelete))
        .rejects
        .toThrow('Event Not Found');
    });

    it('should throw an error if an error occurs during the operation', async () => {
      eventDb.findById.mockRejectedValue(new Error('Database error'));

      await expect(ParticipantsService.deleteParticipants(eventId, participantsToDelete))
        .rejects
        .toThrow('Database error');
    });
  });
});
