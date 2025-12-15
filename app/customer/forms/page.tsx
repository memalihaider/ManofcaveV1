'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, CheckCircle, AlertCircle, ArrowLeft, Download } from 'lucide-react';

export default function CustomerFormsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [forms, setForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      router.push('/customer/login');
    } else {
      loadForms();
    }
  }, [user, router]);

  const loadForms = () => {
    // Mock forms data - replace with real API call
    const mockForms = [
      {
        id: '1',
        title: 'Service Consent Form',
        description: 'Consent for grooming services and treatments',
        type: 'consent',
        status: 'pending',
        required: true,
        lastUpdated: '2025-12-15',
        content: {
          sections: [
            {
              title: 'Service Agreement',
              content: 'I hereby consent to receive grooming services from Man of Cave. I understand that all services are performed by licensed professionals.',
              required: true
            },
            {
              title: 'Health Declaration',
              content: 'I declare that I am in good health and have not been diagnosed with any contagious conditions. I will inform the staff of any health concerns.',
              required: true
            },
            {
              title: 'Product Usage',
              content: 'I consent to the use of professional grooming products during my service. I understand that patch testing may be recommended.',
              required: true
            }
          ]
        }
      },
      {
        id: '2',
        title: 'Intake Form',
        description: 'Client information and service preferences',
        type: 'intake',
        status: 'completed',
        required: true,
        lastUpdated: '2025-12-10',
        content: {
          sections: [
            {
              title: 'Personal Information',
              content: 'Basic contact and personal information collected.',
              required: true
            },
            {
              title: 'Service Preferences',
              content: 'Preferred services, styles, and special requests noted.',
              required: false
            }
          ]
        }
      },
      {
        id: '3',
        title: 'COVID-19 Safety Agreement',
        description: 'Health and safety protocols agreement',
        type: 'consent',
        status: 'pending',
        required: true,
        lastUpdated: '2025-12-01',
        content: {
          sections: [
            {
              title: 'Health Screening',
              content: 'I agree to temperature checks and health screening upon arrival.',
              required: true
            },
            {
              title: 'Sanitation Protocols',
              content: 'I understand and agree to follow all sanitation and safety protocols.',
              required: true
            }
          ]
        }
      }
    ];
    setForms(mockForms);
  };

  const handleFormSubmission = async (formId: string, responses: any) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mock API call - replace with real submission
      const response = await fetch('/api/customer/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          responses,
          submittedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSuccess('Form submitted successfully!');
        // Update form status
        setForms(prev => prev.map(form =>
          form.id === formId ? { ...form, status: 'completed' } : form
        ));
      } else {
        setError('Failed to submit form. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (!user || user.role !== 'customer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/customer/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-primary mb-2">Digital Forms</h1>
          <p className="text-gray-600">Complete required forms and consent agreements</p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {forms.map((form) => (
            <Card key={form.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(form.status)}
                    <div>
                      <CardTitle className="text-lg">{form.title}</CardTitle>
                      <CardDescription>{form.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(form.status)}>
                      {form.status}
                    </Badge>
                    {form.required && (
                      <Badge variant="destructive">Required</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Last updated: {new Date(form.lastUpdated).toLocaleDateString()}
                  </div>

                  {form.status === 'pending' && (
                    <FormSubmission
                      form={form}
                      onSubmit={handleFormSubmission}
                      isLoading={isLoading}
                    />
                  )}

                  {form.status === 'completed' && (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">Form Completed</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormSubmission({ form, onSubmit, isLoading }: { form: any, onSubmit: Function, isLoading: boolean }) {
  const [responses, setResponses] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    // Check if all required sections are agreed to
    const allRequiredAgreed = form.content.sections
      .filter((section: any) => section.required)
      .every((section: any) => responses[section.title]);

    if (!allRequiredAgreed) {
      alert('Please agree to all required sections before submitting.');
      return;
    }

    onSubmit(form.id, responses);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {form.content.sections.map((section: any, index: number) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id={`section-${index}`}
                checked={responses[section.title] || false}
                onCheckedChange={(checked) =>
                  setResponses(prev => ({ ...prev, [section.title]: checked }))
                }
              />
              <div className="flex-1">
                <label
                  htmlFor={`section-${index}`}
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  {section.title}
                  {section.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <p className="text-sm text-gray-600 mt-1">{section.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Form'}
        </Button>
      </div>
    </div>
  );
}