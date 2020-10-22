import React from 'react';
import { Map, Marker } from 'react-amap';

class Amap extends React.Component {

  render() {
    return (
      <>
        <div style={{ width: '100%', height: '400px', position: 'relative' }}>
          <Map events={this.amapEvents} amapkey={'33f1313acb7ed037a03df8e42ee8f23b'}>
            <Marker position={this.markerPosition} events={this.markerEvents} />
          </Map>
        </div>
      </>
    )
  }
}

export default Amap
