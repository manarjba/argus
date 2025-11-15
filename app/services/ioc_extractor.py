import re
import json
from typing import Dict, List, Any

class IOCExtractor:
    def __init__(self):
        # Regular expressions for common IOCs
        self.patterns = {
            'ipv4': r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b',
            'domain': r'\b([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b',
            'md5': r'\b[a-fA-F0-9]{32}\b',
            'sha1': r'\b[a-fA-F0-9]{40}\b',
            'sha256': r'\b[a-fA-F0-9]{64}\b',
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'url': r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[/\w\.-]*\??[/\w\.-=&]*'
        }
    
    def extract_iocs(self, text: str) -> Dict[str, List[str]]:
        """Extract Indicators of Compromise from text"""
        if not text:
            return {}
            
        iocs = {}
        
        for ioc_type, pattern in self.patterns.items():
            matches = re.findall(pattern, text)
            # Clean up matches
            if ioc_type == 'domain':
                # Filter out common non-malicious domains
                matches = [m for m in matches if not any(common in m.lower() for common in 
                          ['microsoft.com', 'google.com', 'apple.com', 'amazon.com'])]
            
            if matches:
                iocs[ioc_type] = list(set(matches))  # Remove duplicates
        
        return iocs

# Create a global instance
ioc_extractor = IOCExtractor()