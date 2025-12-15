import { useCallback } from 'react'
import { Stack, Text, Card } from '@sanity/ui'
import { set, unset } from 'sanity'

export function SlugWithPreview(props) {
  const { value, schemaType, onChange, renderDefault } = props
  const urlPrefix = schemaType.options?.urlPrefix || ''
  const currentSlug = value?.current || ''
  
  return (
    <Stack space={3}>
      {renderDefault(props)}
      {currentSlug && urlPrefix && (
        <Card padding={3} radius={2} tone="primary" style={{ background: 'rgba(255, 107, 53, 0.1)' }}>
          <Text size={1} style={{ fontFamily: 'monospace' }}>
            {urlPrefix}{currentSlug}
          </Text>
        </Card>
      )}
    </Stack>
  )
}

