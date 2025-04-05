import { postAiToolzTextFromImage } from '@/services/TcTkAPI/ai';
import { RootState } from '@/store';
import { PageContainer } from '@ant-design/pro-components';
import { useQuery } from '@tanstack/react-query';
import { useModel } from '@umijs/max';
import { Card, Col, message, Row, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const TextExtractor: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const environment = useSelector((state: RootState) => state.environment.environment);
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  useEffect(() => {
    if (!pastedImage) return;

    console.log('Getting image text.');

    getImageText();

    return () => {};
  }, [pastedImage]);

  const fetchIt = async () => {
    try {
      if (!pastedImage) return;

      const res = await postAiToolzTextFromImage({ imageData: pastedImage ?? '' });
      return res ?? '';
    } catch (error) {
      message.error('Failed to fetch Extract Image Text');
    }

    return null;
  };

  const {
    isLoading: isLoading,
    isError: isError,
    data: data,
    error: error,
    refetch: getImageText,
  } = useQuery({
    queryKey: ['toolz-image-extractor-text', pastedImage],
    queryFn: fetchIt,
    enabled: !!pastedImage,
    staleTime: 0,
    //refetchOnWindowFocus: false,
  });

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setPastedImage(result);
            // TODO: Call your OCR extraction API here using the blob or base64 data.
            // For now, we simulate this by setting placeholder text.

            // To get only the base64 part (without the data URL prefix), use:
            const base64Data = result.split(',')[1];
            //console.log('Base64 data:', base64Data);

            //setExtractedText("Extracted text from image will appear here.");
          };
          reader.readAsDataURL(blob);
          break; // only process the first pasted image
        }
      }
    }
  };

  // function handleExtractText(): void {
  //   getImageText();
  // }

  return (
    <PageContainer title={''}>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12}>
          <Card
            style={{
              borderRadius: 8,
              marginBottom: 16,
            }}
            styles={{
              body: {
                backgroundImage:
                  initialState?.settings?.navTheme === 'realDark'
                    ? 'linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                    : 'linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
              },
            }}
          >
            <div
              onPaste={handlePaste}
              style={{
                border: '2px dashed #d9d9d9',
                borderRadius: 8,
                padding: 20,
                textAlign: 'center',
                minHeight: 200,
                maxHeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {pastedImage ? (
                <img src={pastedImage} alt="Pasted" style={{ maxWidth: '100%', maxHeight: 596 }} />
              ) : (
                <p>CTRL + V your clipboard image here</p>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <Card
            style={{
              borderRadius: 8,
            }}
            styles={{
              body: {
                backgroundImage:
                  initialState?.settings?.navTheme === 'realDark'
                    ? 'linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                    : 'linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
              },
            }}
          >
            <div style={{ marginTop: 0 }}>
              <h3>Extracted Text</h3>
              <Spin spinning={isLoading}>
                <TextArea
                  value={data ?? ''}
                  readOnly
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                  autoSize={{ minRows: 25, maxRows: 25 }}
                  style={{ cursor: 'pointer' }}
                />
              </Spin>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default TextExtractor;
