# Air Quality Monitor

A comprehensive web application for monitoring air quality measurements from meteorological stations in the Hradec Králové Region. The application provides both map-based visualization and tabular data views with historical data analysis.

## 🌟 Features

### Core Functionality
- **Dual View Modes**: Switch seamlessly between interactive map and data table views
- **Real-time Data**: Live air quality measurements from multiple stations
- **Historical Analysis**: View and analyze historical data with customizable date ranges
- **Interactive Map**: Mapbox-powered visualization with station markers and detailed information panels
- **Advanced Search**: Filter stations by name with real-time search functionality
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Data Visualization
- **Line Charts**: Real-time historical data trends with multiple pollutant tracking
- **Bar Charts**: Comparative analysis between different stations
- **Trend Analysis**: Moving averages and prediction graphs
- **Heatmap Overlay**: Visual air quality intensity mapping

### Advanced Map Features
- **Marker Clustering**: Automatic grouping of nearby stations when zoomed out
- **Station Information**: Detailed popup panels with current measurements
- **Interactive Controls**: Zoom, pan, and click interactions
- **Real-time Updates**: Live marker updates with current air quality status

## 🚀 Technology Stack

- **Frontend Framework**: React 19.1.1 with Vite
- **Mapping**: Mapbox GL JS with react-map-gl
- **HTTP Client**: Axios for API communication
- **Styling**: CSS Modules for scoped component styling
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for robust date manipulation
- **State Management**: React Context API with custom hooks
- **Build Tool**: Vite for fast development and optimized builds

## 📊 Architecture

### Component Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── SearchBar/   # Search functionality
│   │   └── ViewToggle/  # View mode switcher
│   ├── charts/          # Data visualization components
│   │   ├── LineChart/   # Historical trend charts
│   │   ├── BarChart/    # Comparative charts
│   │   └── TrendChart/  # Analysis graphs
│   ├── map/             # Map-related components
│   │   ├── MapView/     # Main map container
│   │   ├── StationInfoPanel/ # Station details
│   │   └── MarkerCluster/    # Clustering functionality
│   ├── table/           # Table view components
│   │   ├── TableView/   # Main table container
│   │   └── StationsTable/ # Data table
│   └── ui/              # Basic UI components
│       ├── Button/      # Reusable button
│       ├── Modal/       # Modal dialogs
│       └── Loading/     # Loading indicators
├── contexts/            # React Context providers
├── hooks/               # Custom React hooks
├── api/                 # API integration layer
├── utils/               # Utility functions
└── constants/           # Application constants
```

### Data Flow
1. **API Layer**: Handles REST API communication with proper authentication
2. **Custom Hooks**: Manage data fetching, caching, and state updates
3. **Context Provider**: Global state management for stations and UI state
4. **Components**: Pure components receiving data via props and context

## 🛠 Installation & Setup

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn package manager
- Mapbox access token (for map functionality)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd air-quality-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
   VITE_API_BASE_URL=https://invipo.idshk.cz
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🔌 API Integration

### Authentication
All API requests include the required authorization header:
```
Authorization: Token 2795185a-cd5a-11e8-a8d5-f2801f1b9fd1
```

### Endpoints Used

| Endpoint | Method | Purpose | Parameters |
|----------|--------|---------|------------|
| `/query?name=CityDashboard.Environment.Tile` | POST | Current measurements | None |
| `/query?name=CityDashboard.Environment.List` | POST | Stations list | None |
| `/query?name=CityDashboard.Environment.History` | POST | Historical data | `from`, `to`, `itemId`, `type` |

### Data Structure
- **Stations**: GPS coordinates, names, and identifiers
- **Current Data**: Real-time pollutant measurements (PM2.5, PM10, NO2, SO2, O3)
- **Historical Data**: Time-series data with configurable intervals (hourly/daily)

## 🎨 UI/UX Design

### Design Principles
- **Clean Interface**: Minimalist design focusing on data clarity
- **Responsive Layout**: Mobile-first approach with progressive enhancement
- **Accessibility**: ARIA labels and keyboard navigation support
- **Performance**: Optimized rendering with React.memo and useMemo
- **Color Coding**: Intuitive air quality status indicators

### Color Scheme
- **Primary**: Blue (#007bff) for interactive elements
- **Success**: Green (#28a745) for good air quality
- **Warning**: Yellow (#ffc107) for moderate levels
- **Danger**: Red (#dc3545) for poor air quality
- **Neutral**: Gray scales for secondary information

## 📈 Performance Optimizations

### React Optimizations
- **React.memo**: Prevents unnecessary re-renders of pure components
- **useMemo**: Memoizes expensive calculations and filtered data
- **useCallback**: Stabilizes function references to prevent child re-renders
- **Code Splitting**: Lazy loading for route-based components

### Data Optimizations
- **Debounced Search**: Reduces API calls during user input
- **Caching Strategy**: Local storage for frequently accessed data
- **Efficient State Updates**: Minimal state changes with proper dependency arrays

### Bundle Optimizations
- **Tree Shaking**: Eliminates unused code from final bundle
- **CSS Modules**: Scoped styling reduces global CSS conflicts
- **Asset Optimization**: Compressed images and optimized fonts

## 🧪 Testing Strategy

### Testing Pyramid
- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: Component interactions and data flow
- **E2E Tests**: Full user workflows and API integration

### Test Commands
```bash
npm run test          # Run unit tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage reports
npm run test:e2e      # End-to-end tests
```

## 🚀 Deployment

### Build Process
1. **Environment Variables**: Configure production API endpoints
2. **Bundle Analysis**: Optimize bundle size and performance
3. **Asset Optimization**: Compress and optimize static assets
4. **CDN Integration**: Deploy assets to content delivery network

### Deployment Options
- **Vercel**: Recommended for easy deployment with automatic builds
- **Netlify**: Alternative with excellent CI/CD integration
- **Docker**: Containerized deployment for scalable infrastructure
- **Traditional Hosting**: Static file hosting on any web server

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Bundle Size**: Monitor and optimize application size
- **API Performance**: Track response times and error rates

### Error Tracking
- **Error Boundaries**: Graceful error handling in React components
- **API Error Handling**: Comprehensive error states and user feedback
- **Logging Strategy**: Structured logging for debugging and monitoring

## 🤝 Contributing

### Development Workflow
1. **Feature Branches**: Create branches for new features or fixes
2. **Code Review**: All changes require peer review before merging
3. **Testing**: Ensure all tests pass before submitting
4. **Documentation**: Update documentation for new features

### Code Standards
- **ESLint**: Automated code quality and style checking
- **Prettier**: Consistent code formatting
- **Naming Conventions**: Clear and descriptive component and function names
- **Documentation**: JSDoc comments for all public functions and components

## 📄 License

This project is developed as a technical assessment and is proprietary to the requesting organization.

## 📞 Support

For questions or technical support:
- **Phone**: +420602568825
- **Email**: lukas.duffek@incinity.cz

---

**Last Updated**: September 2025  
**Version**: 1.0.0
