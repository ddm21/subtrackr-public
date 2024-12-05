import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const COUNTRY_CODES = [
  'AF', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH',
  'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW', 'BR', 'BN', 'BG', 'BF', 'BI',
  'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI',
  'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FJ',
  'FI', 'FR', 'GF', 'PF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT',
  'GN', 'GW', 'GY', 'HT', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IL', 'IT', 'JM',
  'JP', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI',
  'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX',
  'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI',
  'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL',
  'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'KN', 'LC', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS',
  'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'SS', 'ES', 'LK', 'SD', 'SR', 'SZ', 'SE', 'CH',
  'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG',
  'UA', 'AE', 'GB', 'US', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'YE', 'ZM', 'ZW'
];

const COUNTRY_CODE_MAP: Record<string, string> = {
  US: '+1', GB: '+44', IN: '+91', CA: '+1', AU: '+61', DE: '+49', FR: '+33', IT: '+39', ES: '+34',
  BR: '+55', RU: '+7', CN: '+86', JP: '+81', KR: '+82', MX: '+52', AR: '+54', ZA: '+27', NG: '+234',
  EG: '+20', SA: '+966', AE: '+971', TR: '+90', PK: '+92', BD: '+880', ID: '+62', PH: '+63',
  VN: '+84', TH: '+66', MY: '+60', SG: '+65', IL: '+972', IR: '+98', IQ: '+964', AF: '+93',
  NP: '+977', LK: '+94', MM: '+95', KH: '+855', LA: '+856', KZ: '+7', UZ: '+998', KG: '+996'
};

export function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Initialize from provided value
    if (value) {
      const countryCode = Object.entries(COUNTRY_CODE_MAP).find(([_, code]) => 
        value.startsWith(code)
      );
      if (countryCode) {
        setSelectedCountry(countryCode[0]);
        setPhoneNumber(value.slice(countryCode[1].length));
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    const newValue = COUNTRY_CODE_MAP[country] + phoneNumber;
    onChange(newValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value.replace(/\D/g, '');
    setPhoneNumber(newPhone);
    const newValue = COUNTRY_CODE_MAP[selectedCountry] + newPhone;
    onChange(newValue);
  };

  return (
    <div className="flex gap-2">
      <Select value={selectedCountry} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((code) => (
            <SelectItem key={code} value={code}>
              {code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder || "Phone number"}
        className="flex-1"
      />
    </div>
  );
}