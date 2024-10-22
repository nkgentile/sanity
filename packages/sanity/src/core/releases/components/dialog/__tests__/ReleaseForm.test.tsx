import {fireEvent, render, screen} from '@testing-library/react'
import {type EditableReleaseDocument, type ReleaseDocument, useDateTimeFormat} from 'sanity'
import {beforeEach, describe, expect, it, type Mock, vi} from 'vitest'

import {createTestProvider} from '../../../../../../test/testUtils/TestProvider'
import {useReleases} from '../../../../store/release'
import {ReleaseForm} from '../ReleaseForm'

vi.mock('../../../../../core/hooks/useDateTimeFormat', () => ({
  useDateTimeFormat: vi.fn(),
}))

vi.mock('../../../../store/release', () => ({
  useReleases: vi.fn(),
}))

const mockUseReleases = useReleases as Mock<typeof useReleases>
const mockUseDateTimeFormat = useDateTimeFormat as Mock

describe('ReleaseForm', () => {
  const onChangeMock = vi.fn()
  const onErrorMock = vi.fn()
  const valueMock: EditableReleaseDocument = {
    _id: 'very-random',
    _type: 'release',
    title: '',
    description: '',
    icon: 'cube',
    hue: 'gray',
    //publishAt: undefined,
  }

  describe('when creating a new release', () => {
    beforeEach(async () => {
      onChangeMock.mockClear()
      onErrorMock.mockClear()

      // Mock the data returned by useBundles hook
      const mockData: ReleaseDocument[] = [
        {
          description: 'What a spring drop, allergies galore 🌸',
          _updatedAt: '2024-07-12T10:39:32Z',
          _rev: 'HdJONGqRccLIid3oECLjYZ',
          createdBy: 'pzAhBTkNX',
          title: 'Spring Drop',
          icon: 'heart-filled',
          _id: 'db76c50e-358b-445c-a57c-8344c588a5d5',
          _type: 'release',
          hue: 'magenta',
          _createdAt: '2024-07-02T11:37:51Z',
        },
        // Add more mock data if needed
      ]
      mockUseReleases.mockReturnValue({
        data: mockData,
        loading: false,
        dispatch: vi.fn(),
        error: undefined,
        deletedReleases: {},
      })

      mockUseDateTimeFormat.mockReturnValue({format: vi.fn().mockReturnValue('Mocked date')})

      const wrapper = await createTestProvider()
      render(<ReleaseForm onChange={onChangeMock} value={valueMock} />, {
        wrapper,
      })
    })

    it('should render the form fields', () => {
      expect(screen.getByTestId('release-form-title')).toBeInTheDocument()
      expect(screen.getByTestId('release-form-description')).toBeInTheDocument()
      //expect(screen.getByTestId('release-form-publish-at')).toBeInTheDocument()
    })

    it('should call onChange when title input value changes', () => {
      const titleInput = screen.getByTestId('release-form-title')
      fireEvent.change(titleInput, {target: {value: 'Bundle 1'}})

      expect(onChangeMock).toHaveBeenCalledWith({...valueMock, title: 'Bundle 1'})
    })

    it('should call onChange when description textarea value changes', () => {
      const descriptionTextarea = screen.getByTestId('release-form-description')
      fireEvent.change(descriptionTextarea, {target: {value: 'New Description'}})

      expect(onChangeMock).toHaveBeenCalledWith({...valueMock, description: 'New Description'})
    })

    /*it('should call onChange when publishAt input value changes', () => {
    const publishAtInput = screen.getByTestId('release-form-publish-at')
    fireEvent.change(publishAtInput, {target: {value: '2022-01-01'}})

    expect(onChangeMock).toHaveBeenCalledWith({...valueMock, publishAt: '2022-01-01'})
  })

  it('should call onChange with undefined when publishAt input value is empty', () => {
    const publishAtInput = screen.getByTestId('release-form-publish-at')
    fireEvent.change(publishAtInput, {target: {value: ' '}})

    expect(onChangeMock).toHaveBeenCalledWith({...valueMock, publishAt: ''})
  })*/

    /*it('should show an error when the publishAt input value is invalid', () => {
    const publishAtInput = screen.getByTestId('release-form-publish-at')
    fireEvent.change(publishAtInput, {target: {value: 'invalid-date'}})

    expect(screen.getByTestId('input-validation-icon-error')).toBeInTheDocument()
  })*/
  })

  describe('when updating an existing release', () => {
    const existingBundleValue: ReleaseDocument = {
      title: 'Summer Drop',
      description: 'Summer time',
      icon: 'heart-filled',
      hue: 'magenta',
    } as ReleaseDocument
    beforeEach(async () => {
      onChangeMock.mockClear()
      onErrorMock.mockClear()

      // Mock the data returned by useBundles hook
      const mockData: ReleaseDocument[] = [
        {
          description: 'What a spring drop, allergies galore 🌸',
          _updatedAt: '2024-07-12T10:39:32Z',
          _rev: 'HdJONGqRccLIid3oECLjYZ',
          createdBy: 'pzAhBTkNX',
          title: 'Spring Drop',
          icon: 'heart-filled',
          _id: 'db76c50e',
          _type: 'release',
          hue: 'magenta',
          _createdAt: '2024-07-02T11:37:51Z',
        },
        // Add more mock data if needed
      ]
      mockUseReleases.mockReturnValue({
        data: mockData,
        loading: false,
        dispatch: vi.fn(),
        deletedReleases: {} as Record<string, ReleaseDocument>,
      })

      mockUseDateTimeFormat.mockReturnValue({format: vi.fn().mockReturnValue('Mocked date')})

      const wrapper = await createTestProvider()
      render(<ReleaseForm onChange={onChangeMock} value={existingBundleValue} />, {
        wrapper,
      })
    })

    it('should allow for any title to be used', async () => {
      const titleInput = screen.getByTestId('release-form-title')
      expect(titleInput).toHaveValue(existingBundleValue.title)
      // the slug of this title already exists,
      // but the slug for the existing edited release will not be changed
      fireEvent.change(titleInput, {target: {value: 'Spring Drop'}})

      expect(screen.queryByTestId('input-validation-icon-error')).not.toBeInTheDocument()
    })

    it('should populate the form with the existing release values', () => {
      expect(screen.getByTestId('release-form-title')).toHaveValue(existingBundleValue.title)
      expect(screen.getByTestId('release-form-description')).toHaveValue(
        existingBundleValue.description,
      )
      screen.getByTestId('release-badge-color-magenta')
      screen.getByTestId('release-badge-icon-heart-filled')
    })
  })
})
