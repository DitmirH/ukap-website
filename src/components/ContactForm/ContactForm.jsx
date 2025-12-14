import { useState, useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import { client, urlFor } from '../../lib/sanityClient'
import './ContactForm.css'

// Default configuration when no Sanity config is provided
const defaultConfig = {
  emailFieldLabel: 'Email Address',
  emailFieldPlaceholder: 'your@email.com',
  fields: [],
  submitButton: { text: 'Send', loadingText: 'Sending...' },
  messages: {
    success: 'Thank you! Your submission has been received.',
    error: 'Something went wrong. Please try again.',
  },
  emailSettings: { recipients: [], subjectPrefix: '[UKAP]' },
  styling: { variant: 'default', maxWidth: 'md' },
}

// Portable Text components for header/footer content
const contentComponents = {
  types: {
    image: ({ value }) => (
      <figure className="form-content-image">
        <img src={urlFor(value).width(600).url()} alt={value.alt || ''} />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="form-heading-2">{children}</h2>,
    h3: ({ children }) => <h3 className="form-heading-3">{children}</h3>,
    h4: ({ children }) => <h4 className="form-heading-4">{children}</h4>,
    normal: ({ children }) => <p className="form-text">{children}</p>,
  },
  marks: {
    highlight: ({ children }) => <span className="highlight">{children}</span>,
    link: ({ value, children }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer">{children}</a>
    ),
  },
}

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

// Format file size for display
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Dynamic field renderer
function FormField({ field, value, onChange, error, onFileChange }) {
  const { fieldType, label, name, placeholder, required, options, helpText, halfWidth, fileSettings } = field
  const fieldName = name?.current || name
  
  const baseProps = {
    id: fieldName,
    name: fieldName,
    placeholder: placeholder || '',
    required: required || false,
    value: value || '',
    onChange: (e) => onChange(fieldName, e.target.value),
    className: error ? 'field-error' : '',
  }

  const renderField = () => {
    switch (fieldType) {
      case 'text':
      case 'phone':
      case 'url':
        return <input type={fieldType === 'phone' ? 'tel' : fieldType === 'url' ? 'url' : 'text'} {...baseProps} />
      
      case 'email':
        return <input type="email" {...baseProps} />
      
      case 'number':
        return <input type="number" {...baseProps} onChange={(e) => onChange(fieldName, e.target.value)} />
      
      case 'date':
        return <input type="date" {...baseProps} />
      
      case 'textarea':
        return <textarea {...baseProps} rows={4} />
      
      case 'select':
        return (
          <select {...baseProps} onChange={(e) => onChange(fieldName, e.target.value)}>
            <option value="">{placeholder || 'Select an option...'}</option>
            {options?.map((opt, i) => (
              <option key={i} value={opt.value || opt.label}>{opt.label}</option>
            ))}
          </select>
        )
      
      case 'radio':
        return (
          <div className="radio-group">
            {options?.map((opt, i) => (
              <label key={i} className="radio-option">
                <input
                  type="radio"
                  name={fieldName}
                  value={opt.value || opt.label}
                  checked={value === (opt.value || opt.label)}
                  onChange={(e) => onChange(fieldName, e.target.value)}
                  required={required && i === 0}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        )
      
      case 'checkbox':
        return (
          <div className="checkbox-group">
            {options?.map((opt, i) => {
              const optValue = opt.value || opt.label
              const isChecked = Array.isArray(value) ? value.includes(optValue) : false
              return (
                <label key={i} className="checkbox-option">
                  <input
                    type="checkbox"
                    name={fieldName}
                    value={optValue}
                    checked={isChecked}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? [...value] : []
                      if (e.target.checked) {
                        currentValues.push(optValue)
                      } else {
                        const idx = currentValues.indexOf(optValue)
                        if (idx > -1) currentValues.splice(idx, 1)
                      }
                      onChange(fieldName, currentValues)
                    }}
                  />
                  <span>{opt.label}</span>
                </label>
              )
            })}
          </div>
        )
      
      case 'file':
        const maxSizeMB = fileSettings?.maxSizeMB || 4
        const maxSizeBytes = maxSizeMB * 1024 * 1024
        const allowMultiple = fileSettings?.multiple || false
        const maxFiles = fileSettings?.maxFiles || 3
        const allowedTypes = fileSettings?.allowedTypes?.join(',') || ''
        
        const handleFileChange = async (e) => {
          const files = Array.from(e.target.files || [])
          
          // Validate file count
          if (allowMultiple && files.length > maxFiles) {
            onChange(fieldName, null, `Maximum ${maxFiles} files allowed`)
            e.target.value = ''
            return
          }
          
          // Validate and process files
          const processedFiles = []
          for (const file of files) {
            // Check size
            if (file.size > maxSizeBytes) {
              onChange(fieldName, null, `File "${file.name}" exceeds ${maxSizeMB}MB limit`)
              e.target.value = ''
              return
            }
            
            try {
              const base64 = await fileToBase64(file)
              processedFiles.push({
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64,
              })
            } catch (err) {
              onChange(fieldName, null, `Error processing file "${file.name}"`)
              return
            }
          }
          
          // Store file data
          if (onFileChange) {
            onFileChange(fieldName, allowMultiple ? processedFiles : processedFiles[0])
          }
          onChange(fieldName, files.map(f => `${f.name} (${formatFileSize(f.size)})`).join(', '))
        }
        
        return (
          <div className="file-upload-wrapper">
            <input
              type="file"
              id={fieldName}
              name={fieldName}
              required={required}
              multiple={allowMultiple}
              accept={allowedTypes}
              onChange={handleFileChange}
              className={error ? 'field-error' : ''}
            />
            <p className="file-hint">
              Max {maxSizeMB}MB{allowMultiple ? ` • Up to ${maxFiles} files` : ''}
              {allowedTypes && ` • ${allowedTypes.replace(/\./g, '').replace(/,/g, ', ')}`}
            </p>
          </div>
        )
      
      default:
        return <input type="text" {...baseProps} />
    }
  }

  return (
    <div className={`form-field ${halfWidth ? 'half-width' : ''} field-type-${fieldType}`}>
      {label && (
        <label htmlFor={fieldName}>
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      {renderField()}
      {helpText && <span className="help-text">{helpText}</span>}
      {error && <span className="error-text">{error}</span>}
    </div>
  )
}

export default function ContactForm({ 
  config: propConfig, 
  formSlug, 
  overrideTitle,
  className = '' 
}) {
  const [status, setStatus] = useState('')
  const [config, setConfig] = useState(propConfig || null)
  const [loading, setLoading] = useState(!propConfig)
  const [formData, setFormData] = useState({})
  const [fileAttachments, setFileAttachments] = useState({})
  const [errors, setErrors] = useState({})

  // Fetch config from Sanity
  useEffect(() => {
    if (propConfig) {
      setConfig({ ...defaultConfig, ...propConfig })
      setLoading(false)
      return
    }

    const query = formSlug
      ? `*[_type == "contactForm" && slug.current == $slug][0]`
      : `*[_type == "contactForm" && isDefault == true][0]`

    client
      .fetch(query, { slug: formSlug })
      .then((data) => {
        if (data) {
          setConfig({ ...defaultConfig, ...data })
        } else {
          setConfig(defaultConfig)
        }
        setLoading(false)
      })
      .catch(() => {
        setConfig(defaultConfig)
        setLoading(false)
      })
  }, [formSlug, propConfig])

  const handleFieldChange = (fieldName, value, errorMessage = null) => {
    if (errorMessage) {
      setErrors(prev => ({ ...prev, [fieldName]: errorMessage }))
      return
    }
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }))
    }
  }

  const handleFileChange = (fieldName, fileData) => {
    setFileAttachments(prev => ({ ...prev, [fieldName]: fileData }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrors({})
    
    // Prepare attachments array
    const attachments = []
    Object.entries(fileAttachments).forEach(([fieldName, data]) => {
      if (Array.isArray(data)) {
        data.forEach(file => attachments.push(file))
      } else if (data) {
        attachments.push(data)
      }
    })
    
    // Build submission data
    const submissionData = {
      ...formData,
      email: formData.email,
      formName: config.name || 'Contact Form',
      recipients: config.emailSettings?.recipients?.map(r => r.email) || [],
      emailSubjectPrefix: config.emailSettings?.subjectPrefix || '[UKAP]',
      subjectField: config.emailSettings?.subjectField,
      attachments: attachments.length > 0 ? attachments : undefined,
    }
    
    try {
      // Use local server in development, Vercel serverless in production
      const apiUrl = import.meta.env.DEV ? 'http://localhost:3001/api/contact' : '/api/contact'
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      })
      
      if (res.ok) {
        setStatus('success')
        setFormData({})
        setFileAttachments({})
        e.target.reset()
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        if (data.errors) setErrors(data.errors)
      }
    } catch (err) {
      setStatus('error')
    }
  }

  if (loading) {
    return <div className="contact-form-loading">Loading form...</div>
  }

  if (!config) {
    return null
  }

  const variant = config.styling?.variant || 'default'
  const maxWidth = config.styling?.maxWidth || 'md'

  return (
    <div className={`contact-form-wrapper variant-${variant} max-w-${maxWidth} ${className}`}>
      {/* Header Content */}
      {config.headerContent && config.headerContent.length > 0 && (
        <div className="form-header-content">
          <PortableText value={config.headerContent} components={contentComponents} />
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        {/* Email field - always required */}
        <div className="form-field field-type-email">
          <label htmlFor="email">
            {config.emailFieldLabel || 'Email Address'}
            <span className="required-mark">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder={config.emailFieldPlaceholder || 'your@email.com'}
            required
            value={formData.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className={errors.email ? 'field-error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Dynamic Fields */}
        <div className="form-fields-grid">
          {config.fields?.map((field, index) => (
            <FormField
              key={field.name?.current || index}
              field={field}
              value={formData[field.name?.current || field.name] || ''}
              onChange={handleFieldChange}
              onFileChange={handleFileChange}
              error={errors[field.name?.current || field.name]}
            />
          ))}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn-submit" 
          disabled={status === 'sending'}
        >
          {status === 'sending' 
            ? (config.submitButton?.loadingText || 'Submitting...') 
            : (config.submitButton?.text || 'Submit')
          }
        </button>
        
        {/* Status Messages */}
        {status === 'success' && (
          <div className="status-message success">
            {config.messages?.success || 'Thank you! Your submission has been received.'}
          </div>
        )}
        {status === 'error' && (
          <div className="status-message error">
            {config.messages?.error || 'Something went wrong. Please try again.'}
          </div>
        )}
      </form>

      {/* Footer Content */}
      {config.footerContent && config.footerContent.length > 0 && (
        <div className="form-footer-content">
          <PortableText value={config.footerContent} components={contentComponents} />
        </div>
      )}
    </div>
  )
}
